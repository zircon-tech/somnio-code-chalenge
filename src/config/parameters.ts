import type { IntegratedConfig, StaticConfig } from './types';
import {AwsRegion, EnvObjects, EnvStages, IEnvironmentVariables } from './types';

export const extractRuntimeParameters = (
  envs: IEnvironmentVariables,
): IntegratedConfig => {
  return {
    [EnvObjects.APP_CONFIG]: {
      stage: envs.STAGE,
      port: envs.APP_PORT,
      seed: envs.SEEDING,
      jobsEnabled: envs.RUN_JOBS,
      awsRegion: envs.AWS_DEPLOY_REGION,
      // isAwsDeploy: boolean;
      // isNotProductionDeploy: boolean;
      // isTestDeploy: boolean;
    },
    [EnvObjects.DB_CONFIG]: {
      host: '',
      port: '',
      name: '',
      options: '',
      pass: '',
      schema: '',
      user: '',
    },
  };
};

export const extractStaticParameters = (
  envs: IEnvironmentVariables,
): StaticConfig => ({
  stage: envs.STAGE,
  nodeEnv: envs.NODE_ENV,
});
