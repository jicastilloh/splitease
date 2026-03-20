import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { AdminGuard } from './Guards/admin.guard';
import { MemberGuard } from './Guards/member.guard';
import { Admin } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember]),
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AdminGuard, MemberGuard],
  exports: [AuthService, AdminGuard, MemberGuard],
  controllers: [AuthController],
})
export class AuthModule {}
