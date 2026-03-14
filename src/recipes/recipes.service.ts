import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface IngredientInput {
  productId: string;
  quantity: number;
}

export interface CreateRecipeInput {
  name: string;
  categoryId: string;
  description?: string;
  ingredients?: IngredientInput[];
}

export interface UpdateRecipeInput {
  name?: string;
  categoryId?: string;
  description?: string;
  ingredients?: IngredientInput[];
}

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    return this.prisma.client as any;
  }

  async create(userId: string, dto: CreateRecipeInput) {
    const ingredients = dto.ingredients ?? [];
    return this.client.recipe.create({
      data: {
        name: dto.name,
        category_id: dto.categoryId,
        description: dto.description ?? null,
        user_id: userId,
        ingredients: {
          create: ingredients.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: {
        category: true,
        ingredients: { include: { product: true } },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.client.recipe.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
      include: {
        category: true,
        ingredients: { include: { product: true } },
      },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const recipe = await this.client.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: { include: { product: true } },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this recipe');
    }

    return recipe;
  }

  async update(userId: string, id: string, dto: UpdateRecipeInput) {
    const existing = await this.client.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!existing) {
      throw new NotFoundException('Recipe not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    const data: Record<string, unknown> = {
      name: dto.name ?? existing.name,
      category_id: dto.categoryId ?? existing.category_id,
      description: dto.description !== undefined ? dto.description : existing.description,
    };

    if (dto.ingredients !== undefined) {
      await this.client.ingredient.deleteMany({ where: { recipe_id: id } });
      data.ingredients = {
        create: dto.ingredients.map((i) => ({
          product_id: i.productId,
          quantity: i.quantity,
        })),
      };
    }

    return this.client.recipe.update({
      where: { id },
      data,
      include: {
        category: true,
        ingredients: { include: { product: true } },
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ success: true }> {
    const existing = await this.client.recipe.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Recipe not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.client.recipe.delete({ where: { id } });

    return { success: true };
  }
}
