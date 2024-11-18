export enum AwsRegion {
  NVirginia = 'us-east-1',
  Ohio = 'us-east-2',
  NCalifornia = 'us-west-1',
  Oregon = 'us-west-2',
}

export enum EnvStages {
  LOCAL = 'local',
  DEV = 'dev',
}

export enum NodeEnvs {
  LOCAL = 'local',
  DEV = 'dev',
}

export enum EnvObjects {
  APP_CONFIG = 'AppConfig',
  DB_CONFIG = 'DbConfig',
}

export interface IEnvironmentVariables {
  // App
  NODE_ENV: NodeEnvs;
  STAGE: EnvStages;
  SEEDING: string;
  APP_PORT: number;
  RUN_JOBS: boolean;
  AWS_DEPLOY_REGION?: AwsRegion;

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
  stage: EnvStages;
  seed: any;
  isAwsDeploy: boolean;
  isNotProductionDeploy: boolean;
  isTestDeploy: boolean;
  awsRegion: AwsRegion;
  jobsEnabled?: boolean;
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
  stage: EnvStages;
  nodeEnv: NodeEnvs;
}
