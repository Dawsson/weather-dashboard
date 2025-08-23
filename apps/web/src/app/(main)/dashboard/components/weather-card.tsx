'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Droplets,
  Eye,
  Gauge,
  MoreVertical,
  Trash2,
  Wind,
} from 'lucide-react';
import { toast } from 'sonner';
import { orpc } from '@/utils/orpc-client';

type FavoriteCity = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  addedAt: Date;
};

type WeatherData = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise?: number;
    sunset?: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility?: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    rain?: { '1h': number };
    snow?: { '1h': number };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }>;
};

interface WeatherCardProps {
  city: FavoriteCity;
  weather?: WeatherData;
  isLoading: boolean;
  error?: Error | null;
}

export function WeatherCard({
  city,
  weather,
  isLoading,
  error,
}: WeatherCardProps) {
  const queryClient = useQueryClient();

  const removeFavoriteMutation = useMutation(
    orpc.users.favorites.removeFavorite.mutationOptions({
      onMutate: async ({ cityId }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({
          queryKey: orpc.users.favorites.getFavorites.key(),
        });

        // Snapshot previous value
        const previousFavorites = queryClient.getQueryData(
          orpc.users.favorites.getFavorites.key()
        );

        // Optimistically update
        queryClient.setQueryData(
          orpc.users.favorites.getFavorites.key(),
          (old: FavoriteCity[]) => old?.filter((c) => c.id !== cityId) || []
        );

        return { previousFavorites };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousFavorites) {
          queryClient.setQueryData(
            orpc.users.favorites.getFavorites.key(),
            context.previousFavorites
          );
        }
        toast.error('Failed to remove city from favorites');
      },
      onSuccess: () => {
        toast.success('City removed from favorites');
      },
    })
  );

  const handleRemoveCity = () => {
    removeFavoriteMutation.mutate({ cityId: city.id });
  };

  if (isLoading) {
    return (
      <Card className="h-64">
        <CardHeader>
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/2 rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-3 rounded bg-gray-200" />
              <div className="h-3 rounded bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-64 border-destructive">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{city.name}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {city.state && `${city.state}, `}
                {city.country}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRemoveCity}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from favorites
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">Failed to load weather data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="h-64">
        <CardHeader>
          <CardTitle className="text-lg">{city.name}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {city.state && `${city.state}, `}
            {city.country}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No weather data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeather = weather.current;
  const tempCelsius = Math.round(currentWeather.temp);
  const feelsLikeCelsius = Math.round(currentWeather.feels_like);

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{city.name}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {city.state && `${city.state}, `}
              {city.country}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="opacity-0 transition-opacity group-hover:opacity-100"
                size="sm"
                variant="ghost"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleRemoveCity}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main temperature display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-3xl">{tempCelsius}°C</div>
            <div className="text-muted-foreground text-sm">
              Feels like {feelsLikeCelsius}°C
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg capitalize">
              {currentWeather.weather[0]?.description}
            </div>
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{currentWeather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>{Math.round(currentWeather.wind_speed * 3.6)} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-orange-500" />
            <span>{currentWeather.pressure} hPa</span>
          </div>
          {currentWeather.visibility && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>{Math.round(currentWeather.visibility / 1000)} km</span>
            </div>
          )}
        </div>

        {/* Weather alerts */}
        {weather.alerts && weather.alerts.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Weather Alert</AlertTitle>
            <AlertDescription className="text-sm">
              {weather.alerts[0].event}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
