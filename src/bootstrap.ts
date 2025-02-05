import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import {
  AppConfig,
  EnvObjects,
  IEnvironmentVariables,
  StaticConfig,
} from './config/types';

type App = any;
type HttpResponse = any;
type HttpRequest = any;
type MiddlewareCallback = any;

export function setupSwagger(app: App, isNotProductionDeploy: boolean) {
  const config = new DocumentBuilder()
    .setTitle('Repose API')
    .setDescription('API to interact with the Repose backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (isNotProductionDeploy) {
    writeFileSync(
      './swagger/swagger-spec.json',
      JSON.stringify(document, null, 2),
    );
  }
  SwaggerModule.setup('api', app, document);
}

export function setupCors(app: App, isNotProductionDeploy: boolean) {
  const corsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    origin: isNotProductionDeploy ? '*' : '', // ToDo: Put frontend (and SSR server) URL when production...
    methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
  };
  app.enableCors(corsOptions);
  // added due to open issue in cors lib https://github.com/expressjs/cors/issues/251
  app.use((_: HttpRequest, res: HttpResponse, next: MiddlewareCallback) => {
    res.setHeader(
      'Access-Control-Allow-Methods',
      corsOptions.methods.join(', '),
    );
    res.header(
      'Access-Control-Allow-Headers',
      corsOptions.allowedHeaders.join(', '),
    );
    next();
  });
}

export function setupEncoders(app: App) {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.getHttpAdapter().getInstance().set('etag', false);
}

export async function bootstrapServices(
  staticParams: StaticConfig,
  environmentVariables: IEnvironmentVariables,
) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(staticParams, environmentVariables),
    {
      // logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    },
  );
  return { app };
}

export async function bootstrap(
  staticParams: StaticConfig,
  environmentVariables: IEnvironmentVariables,
) {
  const { app } = await bootstrapServices(staticParams, environmentVariables);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>(EnvObjects.APP_CONFIG)!;

  setupCors(app, appConfig.isNotProductionDeploy);
  setupSwagger(app, appConfig.isNotProductionDeploy);
  setupEncoders(app);

  app.set('trust proxy', 'loopback');

  return { appConfig, app };
}
