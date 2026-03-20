import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { NewUserCreatedDto } from './dto/user-created.dto';
import { BadRequestUserCreateDto } from './dto/bad-request-user-create.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ChangePasswordDto } from './change-password.dto';
import { Public } from 'src/auth/public.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: NewUserCreatedDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: BadRequestUserCreateDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiBody({ type: CreateUserDto })
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('me')
  @ApiBody({ type: CreateUserDto })
  UpdatedMe(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('change-password')
  changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(user.id, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
