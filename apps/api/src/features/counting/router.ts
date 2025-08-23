import { protectedProcedure, publicProcedure } from '@/lib/orpc';

let count = 0;

export const countingRouter = {
  getCount: publicProcedure.counting.getCount.handler(() => count),
  increment: protectedProcedure.counting.increment.handler(() => ++count),
  decrement: protectedProcedure.counting.decrement.handler(() => --count),
};
