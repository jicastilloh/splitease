import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'password',
  database: process.env.POSTGRES_DB ?? 'splitease',
  synchronize: true,
  logging: false,
  entities: [
    'src/**/*.entity.ts',
    'dist/**/*.entity.js',
  ],
  migrations: [],
});
