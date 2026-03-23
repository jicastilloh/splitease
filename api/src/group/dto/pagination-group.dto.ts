import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, isInt, IsOptional, Min } from 'class-validator';

export class PaginationGroupDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página para la paginación' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional({ example: 10, description: 'Número de elementos por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
