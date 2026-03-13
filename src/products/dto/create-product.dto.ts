import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Buckwheat' })
  name: string;

  @ApiProperty({ description: 'Calories (kcal) per 100g', example: 340, required: false })
  kkal?: number;

  @ApiProperty({ description: 'Proteins per 100g', example: 12.9, required: false })
  proteins?: number;

  @ApiProperty({ description: 'Fats per 100g', example: 3.4, required: false })
  fats?: number;

  @ApiProperty({ description: 'Carbohydrates per 100g', example: 71.5, required: false })
  carbohydrates?: number;

  @ApiProperty({ description: 'Price per unit in user currency', example: 2.5, required: false })
  price?: number;

  @ApiProperty({ description: 'Is product suitable for vegetarians', example: true, required: false })
  isVegetarian?: boolean;

  @ApiProperty({
    description: 'Product category id (foreign key to ProductCategory)',
    example: 'c2d6b4d1-1b47-4a24-9e7a-4b9c8c9b6c1e',
  })
  productCategoryId: string;

  @ApiProperty({
    description: 'Is product visible to all users (common) or only to owner',
    example: false,
    required: false,
  })
  isCommon?: boolean;
}

