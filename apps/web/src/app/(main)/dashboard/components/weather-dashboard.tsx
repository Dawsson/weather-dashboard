'use client';

import { Sun } from 'lucide-react';
import { parseAsFloat, useQueryState } from 'nuqs';
import { CurrentWeatherDisplay } from './current-weather-display';
import { PublicCitySearch } from './public-city-search';

type City = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

export function WeatherDashboard() {
  const [lat, setLat] = useQueryState('lat', parseAsFloat);
  const [lon, setLon] = useQueryState('lon', parseAsFloat);

  // We have coordinates but need to create a city object for display
  // The CurrentWeatherDisplay will handle fetching weather data with these coords
  const selectedCity = lat && lon ? { lat, lon } : null;

  // City selection with URL state persistence
  const handleCitySelect = (city: City) => {
    setLat(city.lat);
    setLon(city.lon);
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <PublicCitySearch onCitySelect={handleCitySelect} />
      </div>

      {selectedCity ? (
        <CurrentWeatherDisplay coordinates={selectedCity} />
      ) : (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <Sun className="h-10 w-10 text-yellow-500" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Search for a city to get started
            </h3>
            <p className="mx-auto max-w-sm text-muted-foreground text-sm">
              We’ll show you current conditions with a clean, readable layout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
