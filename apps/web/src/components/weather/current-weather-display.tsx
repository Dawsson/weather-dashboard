'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Droplets,
  Eye,
  Gauge,
  Heart,
  Moon,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTemperatureUnit } from '@/hooks/use-temperature-unit';
import { authClient } from '@/lib/auth-client';
import { orpc } from '@/utils/orpc-client';

interface CurrentWeatherDisplayProps {
  coordinates: { lat: number; lon: number };
}

export function CurrentWeatherDisplay({
  coordinates,
}: CurrentWeatherDisplayProps) {
  const { unit } = useTemperatureUnit();
  const { data: user } = authClient.useSession();
  const queryClient = useQueryClient();

  const {
    data: weather,
    isLoading,
    error,
  } = useQuery(
    orpc.weather.getCurrentWeather.queryOptions({
      input: { lat: coordinates.lat, lon: coordinates.lon },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
      retry: 3,
    })
  );

  // Create city object from weather data (includes actual city name)
  const city = weather
    ? {
        id: `${weather.lat},${weather.lon}`,
        name: weather.name,
        country: weather.country,
        state: weather.state,
        lat: weather.lat,
        lon: weather.lon,
      }
    : {
        id: `${coordinates.lat},${coordinates.lon}`,
        name: `${coordinates.lat.toFixed(4)}, ${coordinates.lon.toFixed(4)}`,
        country: 'Location',
        state: undefined,
        lat: coordinates.lat,
        lon: coordinates.lon,
      };

  const { data: favorites = [] } = useQuery(
    orpc.users.favorites.getFavorites.queryOptions({
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  );

  const isFavorite = favorites.some((fav) => fav.id === city.id);

  const addFavoriteMutation = useMutation(
    orpc.users.favorites.addFavorite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.users.favorites.getFavorites.key(),
        });
        toast.success('Added to favorites');
      },
      onError: () => {
        toast.error('Failed to add to favorites');
      },
    })
  );

  const removeFavoriteMutation = useMutation(
    orpc.users.favorites.removeFavorite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.users.favorites.getFavorites.key(),
        });
        toast.success('Removed from favorites');
      },
      onError: () => {
        toast.error('Failed to remove from favorites');
      },
    })
  );

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavoriteMutation.mutate({ cityId: city.id });
    } else {
      addFavoriteMutation.mutate({
        id: city.id,
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="animate-pulse">
                <div className="mb-2 h-8 w-48 rounded bg-muted sm:h-10" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-24 animate-pulse rounded bg-muted sm:h-16 sm:w-28" />
                  {user && (
                    <div className="mt-2 h-8 w-8 animate-pulse rounded bg-muted" />
                  )}
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="animate-pulse text-center sm:text-left">
                <div className="mb-1 h-7 w-40 rounded bg-muted" />
                <div className="h-4 w-36 rounded bg-muted" />
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="animate-pulse rounded-full bg-muted p-3">
                  <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                </div>
                <div className="animate-pulse rounded-full bg-muted p-3">
                  <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[...new Array(4)].map((_, i) => (
                <div
                  className="flex items-center gap-4 rounded-lg border bg-card p-4"
                  key={i}
                >
                  <div className="animate-pulse rounded-full bg-muted p-2.5">
                    <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="flex-1 animate-pulse">
                    <div className="mb-1 h-3 w-16 rounded bg-muted" />
                    <div className="h-5 w-12 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="animate-pulse rounded-full bg-muted p-2.5">
                  <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                </div>
                <div className="animate-pulse">
                  <div className="mb-1 h-3 w-12 rounded bg-muted" />
                  <div className="h-5 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="animate-pulse rounded-full bg-muted p-2.5">
                  <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                </div>
                <div className="animate-pulse">
                  <div className="mb-1 h-3 w-12 rounded bg-muted" />
                  <div className="h-5 w-16 rounded bg-muted" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 font-semibold text-lg">
                Failed to load weather data
              </h3>
              <p className="text-sm">
                Please try searching for another city or try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const currentWeather = weather.current;
  const tempCelsius = Math.round(currentWeather.temp);
  const feelsLikeCelsius = Math.round(currentWeather.feels_like);

  const toF = (c: number) => Math.round((c * 9) / 5 + 32);
  const toMph = (kmh: number) => Math.round(kmh * 0.621_371);

  const displayTemp = unit === 'C' ? tempCelsius : toF(tempCelsius);
  const displayFeels = unit === 'C' ? feelsLikeCelsius : toF(feelsLikeCelsius);
  const sunrise = new Date(currentWeather.sunrise! * 1000).toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );
  const sunset = new Date(currentWeather.sunset! * 1000).toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-semibold text-3xl leading-tight sm:text-4xl">
                {city.name}
              </h2>
              <p className="text-muted-foreground">
                {city.state && `${city.state}, `}
                {city.country}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex items-center gap-3">
                <div className="font-bold text-5xl tracking-tight sm:text-6xl">
                  {displayTemp}°{unit}
                </div>
                {user && (
                  <Button
                    className="mt-2"
                    disabled={
                      addFavoriteMutation.isPending ||
                      removeFavoriteMutation.isPending
                    }
                    onClick={handleFavoriteToggle}
                    size="sm"
                    variant={isFavorite ? 'default' : 'outline'}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                    />
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground">
                Feels like {displayFeels}°{unit}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <div className="mb-1 text-2xl capitalize">
                {currentWeather.weather[0]?.description}
              </div>
              <p className="text-muted-foreground text-sm">
                Updated {new Date().toLocaleString()}
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
                <Thermometer className="h-6 w-6 text-primary" />
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/40">
                <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/40">
                <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Humidity</p>
                <p className="font-semibold text-xl">
                  {currentWeather.humidity}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="rounded-full bg-gray-100 p-2.5 dark:bg-gray-800/60">
                <Wind className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Wind</p>
                <p className="font-semibold text-xl">
                  {unit === 'C'
                    ? `${Math.round(currentWeather.wind_speed * 3.6)} km/h`
                    : `${toMph(Math.round(currentWeather.wind_speed * 3.6))} mph`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="rounded-full bg-orange-100 p-2.5 dark:bg-orange-900/40">
                <Gauge className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pressure</p>
                <p className="font-semibold text-xl">
                  {currentWeather.pressure} hPa
                </p>
              </div>
            </div>

            {currentWeather.visibility && (
              <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <div className="rounded-full bg-purple-100 p-2.5 dark:bg-purple-900/40">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Visibility</p>
                  <p className="font-semibold text-xl">
                    {Math.round(currentWeather.visibility / 1000)} km
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentWeather.sunrise && currentWeather.sunset && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-2.5 dark:bg-yellow-900/40">
                  <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Sunrise</p>
                  <p className="font-semibold text-xl">{sunrise}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-indigo-100 p-2.5 dark:bg-indigo-900/40">
                  <Moon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Sunset</p>
                  <p className="font-semibold text-xl">{sunset}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {weather.alerts && weather.alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Weather Alert</AlertTitle>
          <AlertDescription>
            <strong>{weather.alerts[0].event}</strong>
            <br />
            {weather.alerts[0].description.substring(0, 200)}...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
