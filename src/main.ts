import { bootstrap } from './bootstrap';
import { extractStaticParameters } from './config/parameters';
import validateEnvironmentVariables from './config/validate-environment-variables';
import { loadEnvfiles } from './load-envfiles';

loadEnvfiles(process.env.STAGE);
const validatedEnvs = validateEnvironmentVariables(process.env);
const staticParams = extractStaticParameters(validatedEnvs);

bootstrap(staticParams, validatedEnvs).then(({ appConfig, app }) => {
  app.listen(appConfig.port);
});
