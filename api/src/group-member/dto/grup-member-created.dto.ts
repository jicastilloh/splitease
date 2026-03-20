import { ApiProperty } from '@nestjs/swagger';

export class NewGroupMemberCreatedDto {
  @ApiProperty({
    example: 'Miembro agregado al grupo exitosamente',
    description: 'Mensaje de éxito al agregar un nuevo miembro a un grupo',
  })
  message: string;
}
