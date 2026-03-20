import { ApiProperty } from '@nestjs/swagger';

export class BadRequestUserCreateDto {
  @ApiProperty({
    example: 'Error al crear el usuario: El correo electrónico ya está en uso',
    description:
      'Mensaje de error al intentar crear un nuevo usuario con un correo electrónico que ya existe en la base de datos',
  })
  message: string;

  @ApiProperty({
    example: 400,
    description:
      'Código de estado HTTP que indica que la solicitud no se pudo procesar debido a un error del cliente, como datos de entrada inválidos o un conflicto con los datos existentes',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description:
      'Descripción del error HTTP que indica que la solicitud no se pudo procesar debido a un error del cliente, como datos de entrada inválidos o un conflicto con los datos existentes',
  })
  error: string;
}
