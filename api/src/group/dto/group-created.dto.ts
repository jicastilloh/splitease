import { ApiProperty } from '@nestjs/swagger';

export class NewGroupCreatedDto {
  @ApiProperty({
    example: 'Grupo creado exitosamente',
    description: 'Mensaje de éxito al crear un nuevo grupo',
  })
  message: string;
}
