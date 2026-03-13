import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product (owned by current user)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Session() session: UserSession, @Body() body: CreateProductDto) {
    return this.productsService.create(session.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'List products (common + user-owned)' })
  @ApiResponse({ status: 200, description: 'Returns all available products.' })
  async findAll(@Session() session: UserSession) {
    return this.productsService.findAllForUser(session.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single product by id' })
  @ApiResponse({ status: 200, description: 'Returns a single product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.productsService.findOneForUser(session.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update existing product (must be owned by user)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(session.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (must be owned by user)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.productsService.remove(session.user.id, id);
  }
}

