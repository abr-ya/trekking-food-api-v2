import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductCategoryInput {
  name: string;
}

export interface UpdateProductCategoryInput {
  name?: string;
}

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    return this.prisma.client as any;
  }

  async create(dto: CreateProductCategoryInput) {
    const existing = await this.client.productCategory.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }
    return this.client.productCategory.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.client.productCategory.findMany({
      orderBy: { name: 'asc' },
      include: { products: { select: { id: true } } },
    });
  }

  async findOne(id: string) {
    const category = await this.client.productCategory.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      throw new NotFoundException('Product category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateProductCategoryInput) {
    const existing = await this.client.productCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Product category not found');
    }
    if (dto.name !== undefined && dto.name !== existing.name) {
      const byName = await this.client.productCategory.findUnique({
        where: { name: dto.name },
      });
      if (byName) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }
    return this.client.productCategory.update({
      where: { id },
      data: { name: dto.name ?? existing.name },
    });
  }

  async remove(id: string): Promise<{ success: true }> {
    const existing = await this.client.productCategory.findUnique({
      where: { id },
      include: { products: { take: 1 } },
    });
    if (!existing) {
      throw new NotFoundException('Product category not found');
    }
    if (existing.products.length > 0) {
      throw new ConflictException(
        'Cannot delete category that has products. Remove or reassign products first.',
      );
    }
    await this.client.productCategory.delete({ where: { id } });
    return { success: true };
  }
}
