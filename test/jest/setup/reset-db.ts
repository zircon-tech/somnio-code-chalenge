import { PrismaClient } from '@prisma/client';

const dbUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=${process.env.DB_SCHEMA}&${process.env.DB_OPTIONS}`;
const prismaOptions = {
  datasources: {
    db: {
      url: dbUrl,
    },
  },
};
const prisma = new PrismaClient(prismaOptions);

const tables = ['Product', 'TagOfProduct'];

export default async function resetDb() {
  await prisma.$connect();
  const existingTables = tables.filter((table) => (prisma as any)[table]);
  try {
    for (const table of existingTables) {
      await (prisma as any)[table].deleteMany().catch((err: any) => {
        console.log(`error deleting ${table}`);
        throw err;
      });
    }
    await Promise.all(
      existingTables.map((table) => {
        if (!table) {
          return;
        }
        const tableUpperName = `${table
          ?.at(0)
          ?.toUpperCase()}${table.slice(1)}`;
        if (!tableUpperName) {
          return;
        }
        return Promise.all([
          prisma.$executeRawUnsafe(
            `ALTER SEQUENCE IF EXISTS "${tableUpperName}_id_seq" RESTART WITH 1;`,
          ),
          prisma.$executeRawUnsafe(
            `ALTER SEQUENCE IF EXISTS "${table}_id_seq" RESTART WITH 1;`,
          ),
        ]);
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}
