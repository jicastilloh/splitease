import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsUUID,
  Max,
  Min,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { splitType } from '../entities/expense.entity';

class MemberSplitDto {
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent?: number;
}

export class CreateExpenseDto {
  @IsOptional()
  @ApiProperty({ example: 'Cena en restaurante', required: false })
  description?: string;

  @ApiProperty({ example: 150.75 })
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Usuario que pagó (si distinto del token)',
  })
  paidBy?: string;

  @IsOptional()
  @IsEnum(splitType)
  @ApiProperty({ enum: splitType, required: false })
  splitType?: splitType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberSplitDto)
  @ApiProperty({ type: [MemberSplitDto], required: false })
  members?: MemberSplitDto[];
}
