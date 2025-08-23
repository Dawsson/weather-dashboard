'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Droplets,
  Eye,
  Gauge,
  Moon,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { orpc } from '@/utils/orpc-client';

type City = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

interface CurrentWeatherDisplayProps {
  city: City;
}

export function CurrentWeatherDisplay({ city }: CurrentWeatherDisplayProps) {
  const {
    data: weather,
    isLoading,
    error,
  } = useQuery(
    orpc.weather.getCurrentWeather.queryOptions({
      input: { lat: city.lat, lon: city.lon },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
      retry: 3,
    })
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="h-96">
          <CardHeader>
            <div className="animate-pulse">
              <div className="mb-2 h-6 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-6">
              <div className="h-16 w-1/2 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div className="h-12 rounded bg-gray-200" key={i} />
                ))}
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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Main Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl">{city.name}</h2>
              <p className="font-normal text-muted-foreground">
                {city.state && `${city.state}, `}
                {city.country}
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-4xl">{tempCelsius}°C</div>
              <p className="text-muted-foreground">
                Feels like {feelsLikeCelsius}°C
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weather Description */}
          <div className="text-center">
            <div className="mb-2 text-xl capitalize">
              {currentWeather.weather[0]?.description}
            </div>
            <p className="text-muted-foreground text-sm">
              Updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Humidity</p>
                <p className="font-semibold">{currentWeather.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                <Wind className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Wind Speed</p>
                <p className="font-semibold">
                  {Math.round(currentWeather.wind_speed * 3.6)} km/h
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <Gauge className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pressure</p>
                <p className="font-semibold">{currentWeather.pressure} hPa</p>
              </div>
            </div>

            {currentWeather.visibility && (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                  <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Visibility</p>
                  <p className="font-semibold">
                    {Math.round(currentWeather.visibility / 1000)} km
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sun Times */}
          {currentWeather.sunrise && currentWeather.sunset && (
            <div className="grid grid-cols-2 gap-6 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                  <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Sunrise</p>
                  <p className="font-semibold">{sunrise}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
                  <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Sunset</p>
                  <p className="font-semibold">{sunset}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Alerts */}
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
