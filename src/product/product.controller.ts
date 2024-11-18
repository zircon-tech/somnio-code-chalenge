import {Body, Controller, Get,Param,Post,UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import {ProductBulkCreateInputDto, ProductRecommendationResponseDto } from './dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiNoContentResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('similar/:id')
  @ApiOkResponse({ type: ProductRecommendationResponseDto })
  async similarTo(
    @Param('id') productId: string
  ): Promise<ProductRecommendationResponseDto> {
    const productScores = await this.productService.similarTo(productId);
    return {
      recommendations: productScores,
    };
  }

  @Post()
  @ApiNoContentResponse()
  @ApiBody({
    type: ProductBulkCreateInputDto,
  })
  @UseGuards(ThrottlerGuard)
  async bulkCreate(
    @Body() bulkCreateInput: ProductBulkCreateInputDto,
  ) {
    await this.productService.bulkCreate(bulkCreateInput.products);
  }
}
