import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settlement } from './entities/settlement.entity';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settlement, ExpenseSplit, GroupMember])],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
