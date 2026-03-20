import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum } from 'class-validator';
import { Group } from 'src/group/entities/group.entity';
import { JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Entity } from 'typeorm';

export enum GroupMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '12' })
  @Column()
  userId: string;

  @ApiProperty({ example: '23' })
  @Column()
  groupId: string;

  @ApiProperty({ example: 'ADMIN o MEMBER', enum: GroupMemberRole })
  @Column()
  @IsEnum(GroupMemberRole)
  role: GroupMemberRole;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @BeforeInsert()
  setJoinedAt() {
    this.joinedAt = new Date();
  }
}
