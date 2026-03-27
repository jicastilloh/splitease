import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewUserCreatedDto } from './dto/user-created.dto';
import { BadRequestUserCreateDto } from './dto/bad-request-user-create.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ChangePasswordDto } from './change-password.dto';
import { Public } from 'src/auth/public.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiCreatedResponse({
    description: 'El usuario ha sido creado exitosamente.',
    type: NewUserCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta', type: BadRequestUserCreateDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Obtiene el usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('me')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Actualiza el usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  UpdatedMe(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Cambia la contraseña del usuario actual' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(user.id, changePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
