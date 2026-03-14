import { ApiProperty } from '@nestjs/swagger';
import { IngredientItemDto } from './ingredient-item.dto';

export class CreateRecipeDto {
  @ApiProperty({ description: 'Recipe name', example: 'Buckwheat porridge' })
  name: string;

  @ApiProperty({
    description: 'Recipe category id (foreign key to RecipeCategory)',
    example: 'a1b2c3d4-1b47-4a24-9e7a-4b9c8c9b6c1e',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Optional recipe description',
    example: 'Simple breakfast porridge',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'List of ingredients (product id and quantity)',
    type: [IngredientItemDto],
    required: false,
  })
  ingredients?: IngredientItemDto[];
}
