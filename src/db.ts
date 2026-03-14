import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const DB_CONNECT_TIMEOUT_SEC = Number(process.env.DB_CONNECT_TIMEOUT_SEC) || 10;
const DB_QUERY_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS) || 30_000;

function buildConnectionString(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('statement_timeout', String(DB_QUERY_TIMEOUT_MS));
  return url.toString();
}

const connectionString = buildConnectionString(process.env.DATABASE_URL!);

// Pool config: timeouts + resilience when DB/server drops idle connections (e.g. Neon serverless)
const poolConfig = {
  connectionString,
  connectionTimeoutMillis: DB_CONNECT_TIMEOUT_SEC * 1000,
  // Release idle connections after 20s so the pool doesn't reuse connections the server may have closed
  idleTimeoutMillis: 20_000,
  // Keep TCP alive so firewalls/servers are less likely to close idle connections
  keepAlive: true,
};

const adapter = new PrismaPg(poolConfig);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Important: error handling
prisma.$on('error' as any, (error: any) => {
  console.error('Prisma Client error:', error);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
