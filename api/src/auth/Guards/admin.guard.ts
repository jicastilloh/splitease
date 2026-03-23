import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember, GroupMemberRole } from 'src/group-member/entities/group-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.groupId ?? request.params.id ?? request.params.group;

    if (!user || !groupId) {
      throw new ForbiddenException('You must be a member of this group to access this resource.');
    }

    const membership = await this.groupMemberRepository.findOne({
      where: {
        userId: user.id,
        groupId: groupId,
      },
    });

    if (!membership || membership.role !== GroupMemberRole.ADMIN) {
      throw new ForbiddenException('You must be an admin of this group to access this resource.');
    }

    request.groupMember = membership;
    return true;
  }
}
