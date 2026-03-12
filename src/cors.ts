/**
 * Shared CORS config used by Nest and Better Auth.
 * Set CORS_ORIGINS in .env (comma-separated) for production.
 */
export const corsOrigins = process.env.CORS_ORIGINS?.split(',')
  .map((o) => o.trim())
  .filter(Boolean) ?? [
  'http://localhost:5173',
  'http://localhost:3000',
];

export function getCorsOptions() {
  return {
    origin: corsOrigins.length === 1 && corsOrigins[0] === '*' ? true : corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

/** Sets CORS headers on res and returns true if it handled OPTIONS preflight */
export function setCorsHeaders(
  req: { method?: string; headers?: { origin?: string } },
  res: { setHeader: (name: string, value: string) => void; sendStatus?: (code: number) => void },
): boolean {
  const origin = req.headers?.origin;
  const allowed = corsOrigins.includes('*') || (origin && corsOrigins.includes(origin));
  if (origin && allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (corsOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  if (req.method === 'OPTIONS') {
    if (typeof res.sendStatus === 'function') {
      res.sendStatus(204);
    }
    return true;
  }
  return false;
}
