import { IProduct, IProductScore } from './types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductInputDto implements IProduct {
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, required: true, nullable: false, isArray: true })
  tags: string[];
}

export class ProductBulkCreateInputDto {
  @ApiProperty({
    type: ProductInputDto,
    required: true,
    nullable: false,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductInputDto)
  products: ProductInputDto[];
}

export class ProductScoreResponseDto implements IProductScore {
  @ApiProperty({ type: String, required: true, nullable: false })
  productId: string;

  @ApiProperty({ type: Number, required: true, nullable: false })
  score: number;
}

export class ProductRecommendationResponseDto {
  @ApiProperty({
    type: ProductScoreResponseDto,
    required: true,
    nullable: false,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductScoreResponseDto)
  recommendations: ProductScoreResponseDto[];
}
