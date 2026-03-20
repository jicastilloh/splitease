import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { BeforeInsert, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 50.25 })
  @Column()
  amount: number;

  @Column()
  settledAt: Date;

  @ManyToOne(() => User, (user) => user.settlements)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.recievedSettlements)
  toUser: User;

  @BeforeInsert()
  setSettledAt() {
    this.settledAt = new Date();
  }
}
