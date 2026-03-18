import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as path from 'path';
import configuracion from './config/configuracion';

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
        synchronize: false,
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
