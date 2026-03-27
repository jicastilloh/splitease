import { Controller, Request, Get, UseGuards, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAuthGuard } from './auth/Guards/local-auth.guards';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/Guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({ status: 200, description: 'Perfil del usuario obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Obtiene el perfil del usuario' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Mensaje de bienvenida obtenido exitosamente.' })
  @ApiOperation({ summary: 'Obtiene el mensaje de bienvenida' })
  getHello(): string {
    return this.appService.getHello();
  }
}
