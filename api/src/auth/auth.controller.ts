import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './Guards/local-auth.guards';
import { Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { Public } from './public.decorator';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterAuthDto })
  async register(@Body() body: RegisterAuthDto) {
    const exists = await this.authService.userExists(body.email);
    if (exists) {
      throw new UnauthorizedException('User already exists');
    }
    return this.authService.register(body.name, body.password, body.email);
  }

  @Public()
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    try {
      const payload = this.authService.verifyRefreshToken(refreshToken);
      return this.authService.login(payload);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    return { message: 'Logged out successfully' };
  }
}
