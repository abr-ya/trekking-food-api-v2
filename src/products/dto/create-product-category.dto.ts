import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Category name (unique, e.g. Meat, Fish, Grains)',
    example: 'Grains',
  })
  name: string;
}
