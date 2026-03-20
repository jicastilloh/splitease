import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Expense } from 'src/expense/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember, Expense]),
    AuthModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
