import { LOG_LEVELS } from '@nestjs/common';
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().default('password'),
  POSTGRES_DB: Joi.string().default('splitease'),
  JWT_SECRET: Joi.string().required(),

  LOG_LEVEL: Joi.string()
    .valid(...LOG_LEVELS)
    .default('debug'),
})