'use client';

import { useState } from 'react';
import { CitySearch } from './city-search';
import { CurrentWeatherDisplay } from './current-weather-display';

export function PublicWeatherDashboard() {
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  } | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Weather Dashboard
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Get current weather information for any city around the world. Search
          for a city below to see its current weather conditions.
        </p>
      </div>

      <div className="mb-8">
        <CitySearch onCitySelect={setSelectedCity} />
      </div>

      {selectedCity ? (
        <CurrentWeatherDisplay city={selectedCity} />
      ) : (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🌤️</div>
          <h3 className="mb-2 font-semibold text-xl">
            Welcome to Weather Dashboard
          </h3>
          <p className="text-muted-foreground">
            Search for a city above to see its current weather
          </p>
        </div>
      )}
    </div>
  );
}
