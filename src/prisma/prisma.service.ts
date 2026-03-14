import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  get client() {
    return prisma;
  }

  async onModuleInit() {
    console.info('[DB] Connecting to database...');
    try {
      await prisma.$connect();
      console.info('[DB] Database connected successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[DB] Database connection failed or timed out:', message);
      throw error;
    }
  }

  async onModuleDestroy() {
    console.info('[DB] Disconnecting from database...');
    await prisma.$disconnect();
    console.info('[DB] Database disconnected.');
  }
}
