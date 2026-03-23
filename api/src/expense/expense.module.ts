import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { GroupMember } from 'src/group-member/entities/group-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit, Group, GroupMember, User]),
    AuthModule,
    GroupMemberModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
