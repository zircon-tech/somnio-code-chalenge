import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { ToInteger } from '../common/transformers';
import { IEnvironmentVariables } from './types';

class EnvironmentVariables implements IEnvironmentVariables {
  // App
  @IsNotEmpty()
  NODE_ENV: string;
  @IsNotEmpty()
  STAGE: string;
  @IsNotEmpty()
  @IsString()
  SEEDING: string;
  @IsNotEmpty()
  @IsString()
  OPEN_IA_APIKEY: string;
  @IsNotEmpty()
  @IsInt()
  @ToInteger()
  APP_PORT: number;

  // DB
  @IsNotEmpty()
  @IsString()
  DB_HOST: string;
  @IsOptional()
  @IsString()
  DB_OPTIONS?: string;
  @IsNotEmpty()
  @IsString()
  DB_PORT: string;
  @IsNotEmpty()
  @IsString()
  DB_NAME: string;
  @IsNotEmpty()
  @IsString()
  DB_SCHEMA: string;
  @IsNotEmpty()
  @IsString()
  DB_USER: string;
  @IsNotEmpty()
  @IsString()
  DB_PASS: string;
}

export default function validateEnvironmentVariables(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
