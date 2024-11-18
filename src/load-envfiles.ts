import * as dotenv from 'dotenv';
import * as path from 'path';

export function getEnvfilePriority(stage: string) {
  return [`.env`, `${stage}.env`, `defaults.env`];
}

export function loadEnvfiles(stage: string) {
  const envfilesLogicalPaths = getEnvfilePriority(stage);
  const paths = envfilesLogicalPaths.map((envfilesLogicalPath) =>
    path.join(__dirname, `../envfiles/${envfilesLogicalPath}`),
  );
  const loadResults = paths.map((path) =>
    dotenv.config({
      path,
    }),
  );
  const defaultOverrides = loadResults.at(-1);
  if (!defaultOverrides || (defaultOverrides?.error as any)?.errno === -4058) {
    console.warn('no default env file');
  }
}
