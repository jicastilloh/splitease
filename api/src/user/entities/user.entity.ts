import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Group } from 'src/group/entities/group.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @Column()
  name: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Group, (group) => group.createdBy)
  groups: Group[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
  groupMembers: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  expenses: Expense[];

  @OneToMany(() => ExpenseSplit, (expenseSplit) => expenseSplit.fromUser)
  expenseSplits: ExpenseSplit[];

  @OneToMany(() => Settlement, (settlement) => settlement.fromUser)
  settlements: Settlement[];

  @OneToMany(() => Settlement, (settlement) => settlement.toUser)
  recievedSettlements: Settlement[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }
  }
}
