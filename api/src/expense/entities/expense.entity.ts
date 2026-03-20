import { ApiProperty } from '@nestjs/swagger';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'typeorm';

export enum splitType {
  EQUITATIVA = 'EQUITATIVA',
  EXACTA = 'EXACTA',
  PERCENTUAL = 'PERCENTUAL',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Cena en restaurante' })
  @Column()
  description: string;

  @ApiProperty({ example: 150.75 })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.expenses)
  paidBy: User;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @ApiProperty({ example: 'EQUITATIVA, EXACTA o PERCENTUAL', enum: splitType })
  @Column()
  splitType: splitType;

  @Column()
  date: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ExpenseSplit, (expenseSplit) => expenseSplit.expense)
  splits: ExpenseSplit[];

  @BeforeInsert()
  setDate() {
    this.date = new Date();
  }
}
