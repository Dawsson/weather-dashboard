import { APIError } from 'better-auth/api';
import { type FavoriteCity, type User, UserModel } from './schema';

export class FavoritesService {
  private readonly MAX_FAVORITES = 20;

  async getFavorites(userId: string): Promise<FavoriteCity[]> {
    const user = await UserModel.findById(userId).select('favoriteCities');
    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'User not found' });
    }

    return user.favoriteCities || [];
  }

  async addFavorite(
    userId: string,
    city: Omit<FavoriteCity, 'addedAt'>
  ): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'User not found' });
    }

    if (user.favoriteCities.length >= this.MAX_FAVORITES) {
      throw new APIError('BAD_REQUEST', {
        message: `Maximum of ${this.MAX_FAVORITES} favorite cities allowed`,
      });
    }

    const exists = user.favoriteCities.find((fav) => fav.id === city.id);
    if (exists) {
      throw new APIError('CONFLICT', { message: 'City already in favorites' });
    }

    const favoriteCity: FavoriteCity = {
      ...city,
      addedAt: new Date(),
    };

    user.favoriteCities.push(favoriteCity);
    await user.save();

    return user;
  }

  async removeFavorite(userId: string, cityId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'User not found' });
    }

    const cityIndex = user.favoriteCities.findIndex((fav) => fav.id === cityId);
    if (cityIndex === -1) {
      throw new APIError('NOT_FOUND', {
        message: 'City not found in favorites',
      });
    }

    user.favoriteCities.splice(cityIndex, 1);
    await user.save();

    return user;
  }
}
