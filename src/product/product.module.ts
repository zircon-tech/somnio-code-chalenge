import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { OpenapiModule } from '../openapi/openapi.module';

@Module({
  imports: [OpenapiModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
