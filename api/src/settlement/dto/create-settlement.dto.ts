import { ApiProperty } from '@nestjs/swagger';

export class CreateSettlementDto {
  @ApiProperty() fromUserId: string;
  @ApiProperty() toUserId: string;
  @ApiProperty() amount: number;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty({ required: false }) date?: Date;
}