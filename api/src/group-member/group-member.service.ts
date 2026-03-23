import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // ORIGINAL
import { GroupMember, GroupMemberRole } from './entities/group-member.entity';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { Group } from 'src/group/entities/group.entity';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember) private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
  ) {}

  async addMemberToGroup(data: AddMemberDto & { groupId: string }, adminUserId: string) {
    const group = await this.groupRepository.findOne({
      where: { id: data.groupId },
    });
    if (!group) throw new BadRequestException('Group not found');

    const adminMembership = await this.groupMemberRepository.findOne({
      where: {
        groupId: data.groupId,
        userId: adminUserId,
        role: GroupMemberRole.ADMIN,
      },
    });

    if (!adminMembership) {
      throw new ForbiddenException('Only group admins can add members.');
    }

    const existing = await this.groupMemberRepository.findOne({
      where: {
        groupId: data.groupId,
        userId: data.userId,
      },
    });
    if (existing) throw new BadRequestException('User is already a member.');

    const newMember = this.groupMemberRepository.create({
      userId: data.userId,
      groupId: data.groupId,
      role: data.role || GroupMemberRole.MEMBER,
    });

    return await this.groupMemberRepository.save(newMember);
  }

  create(createGroupMemberDto: CreateGroupMemberDto) {
    return 'This action adds a new groupMember';
  }

  async findAll(groupId?: string) {
    if (groupId) {
      return await this.groupMemberRepository.find({ where: { groupId } });
    }
    return await this.groupMemberRepository.find();
  }

  async findOne(idOrGroupId: string, maybeId?: string) {
    const id = maybeId || idOrGroupId;
    const groupMember = await this.groupMemberRepository.findOne({ where: { id } });
    if (!groupMember) throw new BadRequestException('Group member not found');
    return groupMember;
  }

  async update(...args: any[]) {
    // supports both (id, dto) and (groupId, id, userId, dto)
    if (args.length === 2) {
      const [id, updateGroupMemberDto] = args as [string, UpdateGroupMemberDto];
      return `This action updates a #${id} groupMember`;
    }
    // fallback stub for advanced signature — implement as needed
    const id = args[1];
    return `This action updates a #${id} groupMember`;
  }

  async remove(...args: any[]) {
    // supports either remove(id) or remove(groupId, id, userId)
    const id = args.length === 1 ? args[0] : args[1];
    const groupMember = await this.groupMemberRepository.findOne({ where: { id } });
    if (!groupMember) throw new BadRequestException('Group member not found');
    return await this.groupMemberRepository.remove(groupMember);
  }
}
