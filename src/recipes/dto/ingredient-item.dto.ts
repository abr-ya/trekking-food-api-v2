import { ApiProperty } from '@nestjs/swagger';

export class IngredientItemDto {
  @ApiProperty({
    description: 'Product id (foreign key to Product)',
    example: 'c2d6b4d1-1b47-4a24-9e7a-4b9c8c9b6c1e',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity (e.g. grams or units)',
    example: 200,
    minimum: 0,
  })
  quantity: number;
}
