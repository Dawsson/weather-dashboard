import { countingRouter } from '@/features/counting';
import { usersRouter } from '@/features/users';
import { weatherRouter } from '@/features/weather';
import { publicProcedure } from '@/lib/orpc';

export const appRouter = {
  healthCheck: publicProcedure.healthCheck.handler(({ context }) => {
    return {
      message: 'OK',
      user: context.session?.user,
    };
  }),

  counting: countingRouter,
  users: usersRouter,
  weather: weatherRouter,
};

export type AppRouter = typeof appRouter;
