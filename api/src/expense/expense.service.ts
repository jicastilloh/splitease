import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from 'src/group/entities/group.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Expense, splitType } from './entities/expense.entity';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

type MemberSplitInput = {
  userId: string;
  amount?: number;
  percent?: number;
};

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember) private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitRepository: Repository<ExpenseSplit>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private toFixed2(value: number): number {
    return Number(value.toFixed(2));
  }

  private async resolveGroupMemberIds(groupId: string): Promise<string[]> {
    const members = await this.groupMemberRepository.find({
      where: { groupId },
      select: ['userId'],
    });
    return members.map((m) => m.userId);
  }

  private validateMemberIds(members: string[], validIds: string[]) {
    const invalid = members.filter((id) => !validIds.includes(id));
    if (invalid.length) {
      throw new BadRequestException(`Members not in group: ${invalid.join(', ')}`);
    }
  }

  private async buildSplits(
    expense: Expense,
    membersInput: MemberSplitInput[] | undefined,
    payerId: string,
    groupId: string,
  ): Promise<ExpenseSplit[]> {
    const totalAmount = this.toFixed2(expense.amount);
    if (totalAmount <= 0) throw new BadRequestException('Amount must be greater than zero');

    const groupMemberIds = await this.resolveGroupMemberIds(groupId);
    if (!groupMemberIds.includes(payerId)) {
      throw new BadRequestException('Payer must be a member of the group');
    }

    let members: MemberSplitInput[] = [];

    if (expense.splitType === splitType.EQUITATIVA) {
      if (membersInput && membersInput.length) {
        members = [...membersInput];
      } else {
        members = groupMemberIds.map((userId) => ({ userId }));
      }

      // ensure payer is included
      if (!members.some((m) => m.userId === payerId)) {
        members.push({ userId: payerId });
      }

      this.validateMemberIds(
        members.map((m) => m.userId),
        groupMemberIds,
      );

      const count = members.length;
      if (count === 0)
        throw new BadRequestException('At least one member is required to split an expense');

      const base = this.toFixed2(totalAmount / count);
      const splits: ExpenseSplit[] = [];
      let assignedTotal = 0;

      for (let i = 0; i < count; i++) {
        const amount = i === count - 1 ? this.toFixed2(totalAmount - assignedTotal) : base;
        assignedTotal += amount;
        const percent = this.toFixed2((amount / totalAmount) * 100);

        splits.push(
          this.expenseSplitRepository.create({
            amount,
            percentage: percent,
            ispaid: members[i].userId === payerId,
            fromUser: { id: members[i].userId } as User,
            expense,
          }),
        );
      }

      return splits;
    }

    if (!membersInput || !membersInput.length) {
      throw new BadRequestException('Members are required for EXACTA and PERCENTUAL split types');
    }

    this.validateMemberIds(
      membersInput.map((m) => m.userId),
      groupMemberIds,
    );

    const dedupedIds = Array.from(new Set(membersInput.map((m) => m.userId)));
    if (dedupedIds.length !== membersInput.length) {
      throw new BadRequestException('Duplicate member ids are not allowed');
    }

    if (!membersInput.some((m) => m.userId === payerId)) {
      throw new BadRequestException(
        'Payer must be included in members for EXACTA/PERCENTUAL split types',
      );
    }

    if (expense.splitType === splitType.EXACTA) {
      const totalSplitAmount = this.toFixed2(
        membersInput.reduce((sum, m) => sum + (m.amount ?? 0), 0),
      );
      if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
        throw new BadRequestException('Exact split member amounts must sum to the expense amount');
      }

      return membersInput.map((member) => {
        if (member.amount == null) {
          throw new BadRequestException('Amount is required for each member in EXACTA split');
        }
        const amount = this.toFixed2(member.amount);
        const percentage = totalAmount === 0 ? 0 : this.toFixed2((amount / totalAmount) * 100);
        return this.expenseSplitRepository.create({
          amount,
          percentage,
          ispaid: member.userId === payerId,
          fromUser: { id: member.userId } as User,
          expense,
        });
      });
    }

    if (expense.splitType === splitType.PERCENTUAL) {
      const totalPercent = this.toFixed2(
        membersInput.reduce((sum, m) => sum + (m.percent ?? 0), 0),
      );
      if (Math.abs(totalPercent - 100) > 0.01) {
        throw new BadRequestException('Percentual split percentages must sum to 100');
      }

      const splits: ExpenseSplit[] = [];
      let assignedAmount = 0;

      for (let i = 0; i < membersInput.length; i++) {
        const member = membersInput[i];
        if (member.percent == null) {
          throw new BadRequestException('Percent is required for each member in PERCENTUAL split');
        }

        const amount =
          i === membersInput.length - 1
            ? this.toFixed2(totalAmount - assignedAmount)
            : this.toFixed2((totalAmount * member.percent) / 100);

        assignedAmount += amount;

        splits.push(
          this.expenseSplitRepository.create({
            amount,
            percentage: this.toFixed2(member.percent),
            ispaid: member.userId === payerId,
            fromUser: { id: member.userId } as User,
            expense,
          }),
        );
      }

      return splits;
    }

    throw new BadRequestException('Unsupported split type');
  }

  async create(groupId: string, userId: string, dto: CreateExpenseDto) {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    const membership = await this.groupMemberRepository.findOne({ where: { groupId, userId } });
    if (!membership) throw new ForbiddenException('User is not a member of this group');

    const payerId = dto.paidBy || userId;
    const payer = await this.userRepository.findOne({ where: { id: payerId } });
    if (!payer) throw new BadRequestException('Payer not found');

    const amount = dto.amount;
    if (amount == null || amount <= 0) throw new BadRequestException('Amount is required');

    const stype = dto.splitType || splitType.EQUITATIVA;
    const expense = this.expenseRepository.create({
      description: dto.description || '',
      amount,
      splitType: stype,
      group,
      paidBy: payer,
    });
    const saved = await this.expenseRepository.save(expense);

    const rawMembers = dto.members as Array<string | MemberSplitInput> | undefined;
    let membersInput: MemberSplitInput[] | undefined;

    if (rawMembers && rawMembers.length > 0) {
      if (typeof rawMembers[0] === 'string') {
        membersInput = (rawMembers as string[]).map((userId) => ({ userId }));
      } else {
        membersInput = rawMembers as MemberSplitInput[];
      }
    }

    const splits = await this.buildSplits(saved, membersInput, payerId, groupId);
    await this.expenseSplitRepository.save(splits);

    return this.expenseRepository.findOne({
      where: { id: saved.id },
      relations: ['paidBy', 'splits', 'splits.fromUser'],
    });
  }

  async findAll(groupId: string) {
    return this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.fromUser'],
    });
  }

  async findOne(groupId: string, id: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id, group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.fromUser'],
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(
    groupId: string,
    id: string,
    dto: UpdateExpenseDto,
    userId: string,
  ): Promise<Expense>;
  async update(
    groupId: string,
    id: string,
    userId: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense>;
  async update(...args: any[]) {
    // supports both signatures via overloads
    const groupId = args[0] as string;
    const id = args[1] as string;
    let dto: UpdateExpenseDto | undefined;
    let userId: string | undefined;
    if (typeof args[2] === 'string') {
      userId = args[2];
      dto = args[3] as UpdateExpenseDto;
    } else {
      dto = args[2] as UpdateExpenseDto;
      userId = args[3] as string;
    }
    const expense = await this.findOne(groupId, id);
    if (!userId) throw new BadRequestException('User id is required');
    if (expense.paidBy?.id !== userId)
      throw new ForbiddenException('Solo el creador puede editar el gasto');
    if (dto) {
      Object.assign(expense, dto);

      const shouldRebuildSplits =
        dto.amount !== undefined || dto.splitType !== undefined || dto.members !== undefined;
      if (shouldRebuildSplits) {
        await this.expenseSplitRepository
          .createQueryBuilder('split')
          .delete()
          .where('split.expenseId = :expenseId', { expenseId: expense.id })
          .execute();

        const payerSplitId = expense.paidBy?.id || userId;
        const rawMembers = dto.members as Array<string | MemberSplitInput> | undefined;
        let membersInput: MemberSplitInput[] | undefined;

        if (rawMembers && rawMembers.length > 0) {
          if (typeof rawMembers[0] === 'string') {
            membersInput = (rawMembers as string[]).map((userId) => ({ userId }));
          } else {
            membersInput = rawMembers as MemberSplitInput[];
          }
        }

        const newSplits = await this.buildSplits(expense, membersInput, payerSplitId, groupId);
        await this.expenseSplitRepository.save(newSplits);
      }
    }

    return this.expenseRepository.save(expense);
  }

  async remove(groupId: string, id: string, userId: string) {
    const expense = await this.findOne(groupId, id);
    if (expense.paidBy?.id !== userId)
      throw new ForbiddenException('Solo el creador puede eliminar el gasto');
    await this.expenseRepository.softDelete(id);
    return { success: true };
  }
}
