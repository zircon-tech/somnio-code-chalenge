
export enum EnvObjects {
  APP_CONFIG = 'AppConfig',
  DB_CONFIG = 'DbConfig',
}

export interface IEnvironmentVariables {
  // App
  NODE_ENV: string;
  STAGE: string;
  SEEDING: string;
  APP_PORT: number;
  OPEN_IA_APIKEY: string;

  // DB
  DB_HOST: string;
  DB_OPTIONS?: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_SCHEMA: string;
  DB_USER: string;
  DB_PASS: string;
}

export interface AppConfig {
  port: number;
  stage: string;
  seed: string;
  openIaApiKey: string;
  isAwsDeploy: boolean;
  isNotProductionDeploy: boolean;
  isTestDeploy: boolean;
}

export interface DbConfig {
  host: string;
  port: string;
  name: string;
  schema: string;
  user: string;
  pass: string;
  options?: string;
}

export interface IntegratedConfig {
  [EnvObjects.APP_CONFIG]: AppConfig;
  [EnvObjects.DB_CONFIG]: DbConfig;
}

export interface StaticConfig {
  stage: string;
  nodeEnv: string;
}
