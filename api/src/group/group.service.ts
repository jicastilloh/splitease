import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupMember, GroupMemberRole } from 'src/group-member/entities/group-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { last } from 'rxjs';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember) private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
  ) {}
  async create(createGroupDto: CreateGroupDto, createdById: string) {
    const group = this.groupRepository.create({
      ...createGroupDto,
      createdBy: { id: createdById },
    });

    const savedGroup = await this.groupRepository.save(group);

    await this.groupMemberRepository.save({
      userId:createdById ,
      groupId: savedGroup.id,
      role: GroupMemberRole.ADMIN,
    });

    return savedGroup;
  }


  async findAll(page = 1, limit = 10) {

    const take = Math.min(limit, 10);
    const skip = (page - 1) * take;
 
    const [items, total] = await this.groupRepository.findAndCount({
      skip,
      take,
      relations: ['members', 'createdBy'],
    });

    return {
      data:items, 
      meta:{ total,
        page,
        limit: take,
        lastPage: Math.ceil(total / take)
       } };

  }

  async findOne(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['members', 'createdBy'],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    Object.assign(group, updateGroupDto);
    return this.groupRepository.save(group);
  }

  async remove(id: string) {
  const group = await this.groupRepository.findOne({ where: { id } });
  if (!group) throw new NotFoundException('Group not found');

  const expenseCount = await this.expenseRepository.count({ where: { group: { id } } });
  if (expenseCount > 0) {
    throw new BadRequestException('Cannot delete group with active expenses');
  }

  return this.groupRepository.remove(group);
}

  }
