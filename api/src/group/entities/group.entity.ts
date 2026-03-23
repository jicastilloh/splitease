import { ApiProperty } from '@nestjs/swagger';
import { Expense } from 'src/expense/entities/expense.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Viaje a Copán' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Grupo de viaje a Copán' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: 'Lps, $, €' })
  @Column()
  currency: string;

  @ManyToOne(() => User, (user) => user.groups)
  createdBy: User;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  members: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
