import { Global, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { setupCors, setupEncoders } from '../../src/bootstrap';
import CONFIG from './env';
import { OpenapiService } from '../../src/openapi/openapi.service';
import { OpenapiMockedService } from './mock/openapi.mock';

export class CommonFixture {
  public app: INestApplication;

  public openapiMockedService: OpenapiMockedService;

  public readonly OpenapiTestModule: any;

  constructor() {
    this.openapiMockedService = new OpenapiMockedService();
    @Global()
    @Module({
      providers: [
        {
          provide: OpenapiService,
          useValue: this.openapiMockedService,
        },
      ],
      exports: [
        {
          provide: OpenapiService,
          useValue: this.openapiMockedService,
        },
      ],
    })
    class OpenapiTestModule {}

    this.OpenapiTestModule = OpenapiTestModule;
  }

  async beforeEachCommon() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        this.OpenapiTestModule,
        AppModule.register(
          { stage: CONFIG.STAGE, nodeEnv: CONFIG.NODE_ENV },
          CONFIG,
        ),
      ],
    })
      .overrideProvider(OpenapiService)
      .useValue(this.openapiMockedService)
      .compile();

    this.app = moduleFixture.createNestApplication({
      bodyParser: true,
    });
    setupCors(this.app, true);
    setupEncoders(this.app);
    // this.openapiMockedService.clear();
    await this.app.init();
  }

  async afterEachCommon() {
    if (this.app) {
      await this.app.close();
    }
  }
}
