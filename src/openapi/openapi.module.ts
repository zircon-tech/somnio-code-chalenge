import { Module } from '@nestjs/common';
import { OpenapiService } from './openapi.service';

@Module({
  imports: [],
  providers: [OpenapiService],
  exports: [OpenapiService],
})
export class OpenapiModule {}
