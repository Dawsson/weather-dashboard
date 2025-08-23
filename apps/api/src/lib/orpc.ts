import { implement, ORPCError } from '@orpc/server';
import { contract } from '@repo/shared';
import type { Context } from './context';

export const os = implement(contract).$context<Context>();

const authMiddleware = os.middleware(({ context, next }) => {
  if (!context.session) {
    throw new ORPCError('UNAUTHORIZED');
  }

  return next({
    context,
  });
});

export const publicProcedure = os;

export const protectedProcedure = os.use(authMiddleware);
