import { Module } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { MemberGuard } from 'src/auth/Guards/member.guard';
import { Admin } from 'typeorm';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { Group } from 'src/group/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Group])],
  controllers: [GroupMemberController],
  exports: [GroupMemberService, MemberGuard, AdminGuard],
  providers: [GroupMemberService, MemberGuard, AdminGuard],
})
export class GroupMemberModule {}
