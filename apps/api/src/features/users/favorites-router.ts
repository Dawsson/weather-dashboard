import { protectedProcedure } from '@/lib/orpc';
import { FavoritesService } from './favorites-service';

const favoritesService = new FavoritesService();

export const favoritesRouter = {
  getFavorites: protectedProcedure.users.favorites.getFavorites.handler(
    async ({ context }) => {
      const userId = context.session!.session.userId;
      return await favoritesService.getFavorites(userId);
    }
  ),

  addFavorite: protectedProcedure.users.favorites.addFavorite.handler(
    async ({ input, context }) => {
      const userId = context.session!.session.userId;
      await favoritesService.addFavorite(userId, input);
      return true;
    }
  ),

  removeFavorite: protectedProcedure.users.favorites.removeFavorite.handler(
    async ({ input, context }) => {
      const userId = context.session!.session.userId;
      await favoritesService.removeFavorite(userId, input.cityId);
      return true;
    }
  ),

  reorderFavorites: protectedProcedure.users.favorites.reorderFavorites.handler(
    async ({ input, context }) => {
      const userId = context.session!.session.userId;
      await favoritesService.reorderFavorites(userId, input.cityIds);
      return true;
    }
  ),

  clearFavorites: protectedProcedure.users.favorites.clearFavorites.handler(
    async ({ context }) => {
      const userId = context.session!.session.userId;
      await favoritesService.clearFavorites(userId);
      return true;
    }
  ),
};
