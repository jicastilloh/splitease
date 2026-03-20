import { Module } from '@nestjs/common';
import { ExpenseSplitService } from './expense-split.service';
import { ExpenseSplitController } from './expense-split.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseSplit } from './entities/expense-split.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GroupMember } from 'src/group-member/entities/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseSplit, GroupMember]), AuthModule],

  controllers: [ExpenseSplitController],
  providers: [ExpenseSplitService],
})
export class ExpenseSplitModule {}
