import { IsEnum, IsString } from 'class-validator';
import { GroupMemberRole } from '../entities/group-member.entity';

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsString()
  @IsEnum(GroupMemberRole)
  role: GroupMemberRole;
}
