'use client';

import { parseAsFloat, useQueryState } from 'nuqs';
import { FavoritesSection } from '@/components/weather/favorites-section';
import { WeatherDashboard } from '@/components/weather/weather-dashboard';

export default function Home() {
  const [lat, setLat] = useQueryState('lat', parseAsFloat);
  const [lon, setLon] = useQueryState('lon', parseAsFloat);

  const handleFavoriteCitySelect = (city: {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
  }) => {
    setLat(city.lat);
    setLon(city.lon);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="-z-10 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_50%)]" />
        <div className="mx-auto grid gap-6 px-4 py-16 sm:py-20">
          <div className="space-y-4 text-center">
            <h1 className="mx-auto max-w-3xl font-semibold text-4xl tracking-tight sm:text-5xl">
              Weather, at a glance
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
              Search any city worldwide and get clean, real-time conditions
              without the clutter.
            </p>
          </div>
          <div className="mx-auto w-full">
            {/* Primary search entry point */}
            <WeatherDashboard />
          </div>
        </div>
      </section>

      {/* Favorites and Content */}
      <section className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="space-y-8">
          <FavoritesSection onCitySelect={handleFavoriteCitySelect} />
        </div>
      </section>
    </div>
  );
}
