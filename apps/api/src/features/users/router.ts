import { favoritesRouter } from './favorites-router';

// Use `authClient.updateUser` and `authClient.useSession` when possible
export const usersRouter = {
  favorites: favoritesRouter,
};
