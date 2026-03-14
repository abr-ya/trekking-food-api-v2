import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new recipe (owned by current user)' })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({ status: 201, description: 'Recipe created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Session() session: UserSession, @Body() body: CreateRecipeDto) {
    return this.recipesService.create(session.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'List current user recipes' })
  @ApiResponse({ status: 200, description: 'Returns all recipes owned by the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Session() session: UserSession) {
    return this.recipesService.findAllForUser(session.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single recipe by id' })
  @ApiResponse({ status: 200, description: 'Returns a single recipe with category and ingredients.' })
  @ApiResponse({ status: 403, description: 'Forbidden – not owner.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.recipesService.findOneForUser(session.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update existing recipe (must be owned by user)' })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden – not owner.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: UpdateRecipeDto,
  ) {
    return this.recipesService.update(session.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe (must be owned by user)' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden – not owner.' })
  @ApiResponse({ status: 404, description: 'Recipe not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.recipesService.remove(session.user.id, id);
  }
}
