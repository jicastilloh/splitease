import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { Settlement } from './entities/settlement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitRepository: Repository<ExpenseSplit>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  async create(groupId: string, dto: any, currentUserId: string) {
    const member = await this.groupMemberRepository.findOne({ where: { groupId, userId: currentUserId } });
    if (!member) throw new NotFoundException('No eres miembro de este grupo');

    const fromMember = await this.groupMemberRepository.findOne({ where: { groupId, userId: dto.fromUserId } });
    const toMember = await this.groupMemberRepository.findOne({ where: { groupId, userId: dto.toUserId } });
    if (!fromMember || !toMember) throw new NotFoundException('Usuarios no pertenecen al grupo');

    const settlement = this.settlementRepository.create({
      fromUser: { id: dto.fromUserId } as User,
      toUser: { id: dto.toUserId } as User,
      amount: dto.amount ?? 0,
      settledAt: dto.date ? new Date(dto.date) : new Date(),
    });

    const saved = await this.settlementRepository.save(settlement);

    await this.expenseSplitRepository.update(
      { fromUser: { id: dto.fromUserId }, expense: { group: { id: groupId } } },
      { ispaid: true },
    );

    return saved;
  }

  async findByGroup(groupId: string) {
    return this.settlementRepository
      .createQueryBuilder('settlement')
      .leftJoinAndSelect('settlement.fromUser', 'fromUser')
      .leftJoinAndSelect('fromUser.groupMembers', 'fromUserGroupMembers')
      .leftJoinAndSelect('settlement.toUser', 'toUser')
      .leftJoinAndSelect('toUser.groupMembers', 'toUserGroupMembers')
      .where('fromUserGroupMembers.groupId = :groupId OR toUserGroupMembers.groupId = :groupId', { groupId })
      .orderBy('settlement.settledAt', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const settlement = await this.settlementRepository.findOne({
      where: { id },
      relations: ['fromUser', 'toUser'],
    });
    if (!settlement) throw new NotFoundException('Settlement no encontrado');
    return settlement;
  }

  async update(id: string, dto: Partial<any>) {
    const settlement = await this.findOne(id);
    if (dto.amount !== undefined) settlement.amount = dto.amount;
    if (dto.date !== undefined) settlement.settledAt = new Date(dto.date);
    return this.settlementRepository.save(settlement);
  }

  async remove(id: string) {
    const settlement = await this.findOne(id);
    return this.settlementRepository.remove(settlement);
  }
}
