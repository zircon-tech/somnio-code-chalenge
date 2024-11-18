const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const path = require('path');

function loadEnvFiles(stage) {
  function getEnvFilePriority(stage) {
    return [
      `.env`,
      `.secret.env`,
      `${stage}.secret.env`,
      `${stage}.env`,
      `shared/defaults.secret.env`,
      `shared/defaults.env`,
    ];
  }
  const envFilesLogicalPaths = getEnvFilePriority(stage);
  const paths = envFilesLogicalPaths.map((envFilesLogicalPath) =>
    path.join(__dirname, `../envfiles/${envFilesLogicalPath}`),
  );
  paths.forEach((path) => {
    const result = dotenv.config({ path });
    if (result.error) {
      console.warn('[WARN]', result.error.message);
      return;
    }
    dotenvExpand.expand(result);
  });
}

loadEnvFiles(process.env.STAGE || '');
