import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as path from 'path';
import configuracion from './config/configuracion';
import { GroupModule } from './group/group.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseSplitModule } from './expense-split/expense-split.module';
import { SettlementModule } from './settlement/settlement.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/Guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '..', '.env'),
      isGlobal: true,
      load: [configuracion],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    GroupModule,
    GroupMemberModule,
    ExpenseModule,
    ExpenseSplitModule,
    SettlementModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
