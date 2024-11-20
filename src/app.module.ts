import { DynamicModule, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IEnvironmentVariables, StaticConfig } from './config/types';
import { extractRuntimeParameters } from './config/parameters';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // AppLoggerModule,
    PrismaModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static register(
    staticParams: StaticConfig,
    environmentVariables: IEnvironmentVariables,
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return extractRuntimeParameters(environmentVariables);
            },
          ],
          cache: true,
          expandVariables: true,
        }),
      ],
    };
  }
}
