import { IEnvironmentVariables } from '../../src/config/types';

function defined(val: string | undefined): string {
  if (val === undefined) {
    throw new Error(`${val} should not be undefined`);
  }
  return val;
}

const DB_HOST = defined(process.env.DB_HOST);
const DB_OPTIONS = defined(process.env.DB_OPTIONS);
const DB_PORT = defined(process.env.DB_PORT);
const DB_NAME = defined(process.env.DB_NAME);
const DB_SCHEMA = defined(process.env.DB_SCHEMA);
const DB_USER = defined(process.env.DB_USER);
const DB_PASS = defined(process.env.DB_PASS);

const config: IEnvironmentVariables = {
  OPEN_IA_APIKEY: 'string',

  NODE_ENV: 'dev',
  STAGE: 'test',
  SEEDING: '123',
  APP_PORT: 1234,

  DB_HOST: DB_HOST,
  DB_OPTIONS: DB_OPTIONS,
  DB_PORT: DB_PORT,
  DB_NAME: DB_NAME,
  DB_SCHEMA: DB_SCHEMA,
  DB_USER: DB_USER,
  DB_PASS: DB_PASS,
} as const;

export default config;
