import { betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './db';
import { corsOrigins } from './cors';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: corsOrigins,
  experimental: {
    joins: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const session = ctx.context.newSession;
      if (!session) return;
      if (ctx.path.startsWith('/sign-in')) {
        console.info('[BetterAuth:info] Sign-in success', { userId: session.user.id, email: session.user.email });
      } else if (ctx.path.startsWith('/sign-up')) {
        console.info('[BetterAuth:info] Sign-up success', { userId: session.user.id, email: session.user.email });
      }
    }),
  },
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true,
    },
  },
  logger: {
    level: 'debug',
    disabled: false,
    log: (level, message, ...args) => {
      const prefix = `[BetterAuth:${level}]`;
      if (level === 'error') console.error(prefix, message, ...args);
      else if (level === 'warn') console.warn(prefix, message, ...args);
      else if (level === 'info') console.info(prefix, message, ...args); // success / info
      else console.log(prefix, message, ...args); // debug
    },
  },
});
