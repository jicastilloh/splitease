import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MemberGuard implements CanActivate{
    constructor(
        @InjectRepository(GroupMember)
        private groupMemberRepository: Repository<GroupMember>,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const groupId = request.params.groupId ?? request.params.id ?? request.params.group;

        if (!user || !groupId) {
            throw new ForbiddenException('No autorizado');
        }

        const membership = await this.groupMemberRepository.findOne({
            where: {
                userId: user.id,
                groupId: groupId,
            },
        });

        if (!membership) {
            throw new ForbiddenException('solo miembros del grupo pueden acceder a este recurso');
        }

        return true;
    }
}