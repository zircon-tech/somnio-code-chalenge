import {DynamicModule, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReshapeExceptionFilter } from './reshape-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import {IEnvironmentVariables, StaticConfig } from './config/types';
import { extractRuntimeParameters } from './config/parameters';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    // AppLoggerModule,
    // ScheduleModule.forRoot(),
    // AWSModule,
    // PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ReshapeExceptionFilter,
    },
  ],
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

