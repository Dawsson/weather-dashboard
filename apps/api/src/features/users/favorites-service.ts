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

  async reorderFavorites(userId: string, cityIds: string[]): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'User not found' });
    }

    const currentCityIds = user.favoriteCities.map((fav) => fav.id);
    const missingIds = cityIds.filter((id) => !currentCityIds.includes(id));
    const extraIds = currentCityIds.filter((id) => !cityIds.includes(id));

    if (missingIds.length > 0 || extraIds.length > 0) {
      throw new APIError('BAD_REQUEST', {
        message: 'Invalid city IDs provided for reordering',
      });
    }

    const reorderedFavorites: FavoriteCity[] = [];
    for (const cityId of cityIds) {
      const city = user.favoriteCities.find((fav) => fav.id === cityId);
      if (city) {
        reorderedFavorites.push(city);
      }
    }

    user.favoriteCities = reorderedFavorites;
    await user.save();

    return user;
  }

  async clearFavorites(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new APIError('NOT_FOUND', { message: 'User not found' });
    }

    user.favoriteCities = [];
    await user.save();

    return user;
  }
}
