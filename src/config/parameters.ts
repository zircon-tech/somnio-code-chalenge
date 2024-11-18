import type { IntegratedConfig, StaticConfig } from './types';
import {EnvObjects, IEnvironmentVariables } from './types';

export const extractRuntimeParameters = (
  envs: IEnvironmentVariables,
): IntegratedConfig => {
  return {
    [EnvObjects.APP_CONFIG]: {
      stage: envs.STAGE,
      port: envs.APP_PORT,
      seed: envs.SEEDING,
      openIaApiKey: envs.OPEN_IA_APIKEY,
      isAwsDeploy: ['dev'].includes(
        envs.STAGE,
      ),
      isNotProductionDeploy: [
        'dev',
        'local',
        'test',
      ].includes(envs.STAGE),
      isTestDeploy: ['test'].includes(envs.STAGE),
    },
    [EnvObjects.DB_CONFIG]: {
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      name: envs.DB_NAME,
      schema: envs.DB_SCHEMA,
      user: envs.DB_USER,
      pass: envs.DB_PASS,
      options: envs.DB_OPTIONS,
    },
  };
};

export const extractStaticParameters = (
  envs: IEnvironmentVariables,
): StaticConfig => ({
  stage: envs.STAGE,
  nodeEnv: envs.NODE_ENV,
});
