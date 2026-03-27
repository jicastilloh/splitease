import { Logger, Module } from '@nestjs/common';
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
import { BalancesModule } from './balances/balances.module';
import { HealthModule } from './health/health.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomLogger } from './logger/custom-logger.service';
import { envValidationSchema } from './config/env.schema';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 100 }],
    }),
    ConfigModule.forRoot({    
      envFilePath: [
        path.join(__dirname, '..', '.env'),
        path.join(process.cwd(), '.env'),
      ],
      isGlobal: true,
      load: [configuracion],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
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
    BalancesModule,
    HealthModule,
  ],
  providers: [
    CustomLogger, {provide: Logger, useClass: CustomLogger},
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      
    },
  ],
  exports: [Logger, CustomLogger],
})
export class AppModule {}
