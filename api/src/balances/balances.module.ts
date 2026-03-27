import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { User } from 'src/user/entities/user.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { ExpenseSplitModule } from 'src/expense-split/expense-split.module';
import { SettlementModule } from 'src/settlement/settlement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit, Settlement, User]),
    GroupMemberModule,
    ExpenseSplitModule,
    SettlementModule,
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
