import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { AppConfig, DbConfig, EnvObjects } from '../config/types';

let globalClient: PrismaClient | undefined = undefined;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  private createClient() {
    const { isNotProductionDeploy } = this.configService.get<AppConfig>(
      EnvObjects.APP_CONFIG,
    )!;
    let prismaClient;
    const {
      host: dbhost,
      port: dbport,
      name: dbname,
      schema: dbschema,
      user: dbuser,
      pass: dbpass,
      options: dboptions,
    } = this.configService.get<DbConfig>(EnvObjects.DB_CONFIG)!;
    const dbUrl = `postgresql://${dbuser}:${dbpass}@${dbhost}:${dbport}/${dbname}?schema=${dbschema}&${dboptions}`;
    if (isNotProductionDeploy) {
      prismaClient = new PrismaClient({
        // log: [{ level: 'query', emit: 'event' }],
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      });
      // prismaClient.$on('query', (ev: any) => {
      //   console.log(`Query: ${ev.query}. Params: ${ev.params}.`);
      // });
    } else {
      prismaClient = new PrismaClient({
        log: [{ level: 'error', emit: 'stdout' }],
        datasources: { db: { url: dbUrl } },
      });
    }
    return prismaClient;
  }

  constructor(private readonly configService: ConfigService) {
    const { isTestDeploy } = configService.get<AppConfig>(
      EnvObjects.APP_CONFIG,
    )!;
    let client;
    if (isTestDeploy) {
      if (!globalClient) {
        globalClient = this.createClient();
      }
      client = globalClient;
    } else {
      client = this.createClient();
    }
    this.client = client;
  }

  async onModuleInit() {
    if (this.client) {
      await this.client.$connect();
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect();
    }
  }
}
