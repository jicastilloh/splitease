import { ApiProperty } from '@nestjs/swagger';

export class BadRequestGroupMemberCreateDto {
  @ApiProperty({
    example: 'Error al agregar miembro al grupo',
    description: 'Mensaje de error al intentar agregar un nuevo miembro a un grupo',
  })
  message: string;
  @ApiProperty({
    example: '400',
    description: 'Código de estado HTTP para una solicitud incorrecta',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Descripción del error HTTP para una solicitud incorrecta',
  })
  error: string;
}
