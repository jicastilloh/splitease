import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Vacaciones 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Grupo para organizar gastos de las vacaciones' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
