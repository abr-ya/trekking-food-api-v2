import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
  // Important: pool settings
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      // For timeouts, add to DATABASE_URL: ?connect_timeout=30&options=-c%20statement_timeout%3D30000
    },
  },
});

// Important: error handling
prisma.$on('error' as any, (error: any) => {
  console.error('Prisma Client error:', error);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
