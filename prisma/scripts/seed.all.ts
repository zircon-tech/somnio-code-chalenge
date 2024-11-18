import { extractStaticParameters } from '../../src/config/parameters';
import validateEnvironmentVariables from '../../src/config/validate-environment-variables';
import { loadEnvfiles } from '../../src/load-envfiles';
import users from './users';

loadEnvfiles(process.env.STAGE);
const validatedEnvs = validateEnvironmentVariables(process.env);
const {stage} = extractStaticParameters(validatedEnvs);

export default async function seedAll() {
  if (stage !== 'production' && stage !== 'test') {
    await users();
  }
}
