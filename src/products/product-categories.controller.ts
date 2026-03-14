import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product category' })
  @ApiBody({ type: CreateProductCategoryDto })
  @ApiResponse({ status: 201, description: 'Product category created successfully.' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Session() session: UserSession, @Body() body: CreateProductCategoryDto) {
    return this.productCategoriesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  @ApiResponse({ status: 200, description: 'Returns all product categories with product count.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Session() session: UserSession) {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single product category by id' })
  @ApiResponse({ status: 200, description: 'Returns a single category with its products.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product category' })
  @ApiBody({ type: UpdateProductCategoryDto })
  @ApiResponse({ status: 200, description: 'Product category updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product category (fails if it has products)' })
  @ApiResponse({ status: 200, description: 'Product category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  @ApiResponse({ status: 409, description: 'Cannot delete category that has products.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.productCategoriesService.remove(id);
  }
}
