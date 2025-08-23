'use client';

import { useQueries } from '@tanstack/react-query';
import { orpc } from '@/utils/orpc-client';
import { WeatherCard } from './weather-card';

type FavoriteCity = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  addedAt: Date;
};

interface FavoritesListProps {
  favorites: FavoriteCity[];
}

export function FavoritesList({ favorites }: FavoritesListProps) {
  // Batch load weather data for all favorite cities
  const weatherQueries = useQueries({
    queries: favorites.map((city) =>
      orpc.weather.getCurrentWeather.queryOptions({
        input: { lat: city.lat, lon: city.lon },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
        retry: 3,
      })
    ),
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {favorites.map((city, index) => {
        const weatherQuery = weatherQueries[index];

        return (
          <WeatherCard
            city={city}
            error={weatherQuery.error}
            isLoading={weatherQuery.isLoading}
            key={city.id}
            weather={weatherQuery.data}
          />
        );
      })}
    </div>
  );
}
