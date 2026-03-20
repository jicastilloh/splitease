import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, { ignoreExpiration: false });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }

  async register(name: string, password: string, email: string) {
    return this.userService.create({ name, password, email });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const id = user.id || user.sub;
    const name = user.name || user.username;
    const payload = { name, sub: id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      access_token,
      refresh_token,
    };
  }
}
