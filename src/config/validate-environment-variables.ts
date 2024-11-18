import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { ToBoolean, ToEnum, ToInteger } from '../common/transformers';
import { AwsRegion, EnvStages, IEnvironmentVariables, NodeEnvs } from './types';

class EnvironmentVariables implements IEnvironmentVariables {
  // App
  @IsNotEmpty()
  @IsEnum(NodeEnvs)
  // @ToEnum(NodeEnvs)
  NODE_ENV: NodeEnvs;
  @IsNotEmpty()
  @IsEnum(EnvStages)
  // @ToEnum(EnvStages)
  STAGE: EnvStages;
  @IsNotEmpty()
  @IsString()
  SEEDING: EnvStages;
  @IsNotEmpty()
  @IsInt()
  @ToInteger()
  APP_PORT: number;
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  RUN_JOBS: boolean;
  @IsOptional()
  @IsEnum(AwsRegion)
  // @ToEnum(AwsRegion)
  AWS_DEPLOY_REGION?: AwsRegion;

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
