import { ApiProperty } from '@nestjs/swagger';

export class NewUserCreatedDto {
  @ApiProperty({
    example: 'Usuario creado exitosamente',
    description: 'Mensaje de éxito al crear un nuevo usuario',
  })
  message: string;
}
