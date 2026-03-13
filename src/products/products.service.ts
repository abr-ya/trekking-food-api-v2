import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductInput {
  name: string;
  kkal?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  price?: number;
  isVegetarian?: boolean;
  productCategoryId: string;
  isCommon?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  kkal?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  price?: number;
  isVegetarian?: boolean;
  productCategoryId?: string;
  isCommon?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    // Cast to any to avoid compile-time dependency on generated Prisma delegates
    return this.prisma.client as any;
  }

  async create(userId: string, dto: CreateProductInput) {
    return this.client.product.create({
      data: {
        name: dto.name,
        kkal: dto.kkal ?? 0,
        proteins: dto.proteins ?? 0,
        fats: dto.fats ?? 0,
        carbohydrates: dto.carbohydrates ?? 0,
        price: dto.price ?? 0,
        is_vegetarian: dto.isVegetarian ?? false,
        product_category_id: dto.productCategoryId,
        is_common: dto.isCommon ?? true,
        user_id: userId,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.client.product.findMany({
      where: {
        OR: [{ is_common: true }, { user_id: userId }],
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const product = await this.client.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.is_common && product.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this product');
    }

    return product;
  }

  async update(userId: string, id: string, dto: UpdateProductInput) {
    const existing = await this.client.product.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.client.product.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        kkal: dto.kkal ?? existing.kkal,
        proteins: dto.proteins ?? existing.proteins,
        fats: dto.fats ?? existing.fats,
        carbohydrates: dto.carbohydrates ?? existing.carbohydrates,
        price: dto.price ?? existing.price,
        is_vegetarian: dto.isVegetarian ?? existing.is_vegetarian,
        product_category_id: dto.productCategoryId ?? existing.product_category_id,
        is_common: dto.isCommon ?? existing.is_common,
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ success: true }> {
    const existing = await this.client.product.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.client.product.delete({ where: { id } });

    return { success: true };
  }
}

