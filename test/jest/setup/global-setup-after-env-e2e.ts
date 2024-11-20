import resetDb from './reset-db';

jest.setTimeout(50_000);

beforeEach(async () => {
  // console.log('================== RESETTING DB ==================');
  await resetDb();
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
