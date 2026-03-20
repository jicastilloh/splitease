import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupMemberDto {
  @ApiProperty({
    example: 1,
    description: 'ID del grupo al que se desea agregar el miembro',
  })
  groupId: number;
}
