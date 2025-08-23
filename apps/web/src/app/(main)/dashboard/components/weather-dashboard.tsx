'use client';

import { Cloud } from 'lucide-react';
import { useState } from 'react';
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
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Simple city selection without URL state for now
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-semibold text-3xl tracking-tight sm:text-4xl">
          Weather
        </h1>
      </div>

      <div className="mb-8">
        <PublicCitySearch onCitySelect={handleCitySelect} />
      </div>

      {selectedCity ? (
        <CurrentWeatherDisplay city={selectedCity} />
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <Cloud className="mx-auto h-12 w-12 text-muted-foreground/40" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
              Check the weather
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter a city name to get current conditions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
