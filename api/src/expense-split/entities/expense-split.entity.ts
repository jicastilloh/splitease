import { ApiProperty } from '@nestjs/swagger';
import { Expense } from 'src/expense/entities/expense.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 50.25 })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: 25 })
  @Column('decimal', { precision: 5, scale: 2 })
  percentage: number;

  @ApiProperty({ example: 'true o false' })
  @Column()
  ispaid: boolean;

  @ManyToOne(() => User, (user) => user.expenseSplits)
  fromUser: User;

  @ManyToOne(() => Expense, (expense) => expense.splits)
  expense: Expense;
}
