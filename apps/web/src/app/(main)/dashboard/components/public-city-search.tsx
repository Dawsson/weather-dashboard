'use client';

import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { orpc } from '@/utils/orpc-client';

type City = {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

interface PublicCitySearchProps {
  onCitySelect: (city: City) => void;
}

export function PublicCitySearch({ onCitySelect }: PublicCitySearchProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [debouncedQuery] = useDebounce(query, 300);

  const { data: cities = [], isLoading } = useQuery(
    orpc.weather.searchCities.queryOptions({
      input: {
        query: debouncedQuery || '',
        limit: 5,
      },
      enabled: mounted && Boolean(debouncedQuery && debouncedQuery.length >= 3),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 3,
    })
  );

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setQuery('');
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(Boolean(query && query.length >= 3));
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-5 h-5 w-5 text-muted-foreground" />
        <Input
          className="h-14 w-full rounded-full border bg-background pr-6 pl-14 text-lg placeholder:text-muted-foreground focus-visible:ring-2"
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(query.length >= 3)}
          placeholder="Search for a city..."
          value={query}
        />

        {isOpen && (
          <div className="absolute top-full z-50 mt-2 w-full">
            <Card className="border shadow-lg">
              <div className="max-h-80 overflow-y-auto">
                {isLoading && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Searching...
                  </div>
                )}
                {!isLoading && cities.length === 0 && query.length >= 3 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No cities found.
                  </div>
                )}
                {!isLoading &&
                  cities.length === 0 &&
                  query.length < 3 &&
                  query.length > 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Keep typing... (need at least 3 characters)
                    </div>
                  )}
                {!isLoading && cities.length === 0 && query.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Start typing to search for cities
                  </div>
                )}
                {!isLoading && cities.length > 0 && (
                  <div className="p-2">
                    {cities.map((city) => (
                      <div
                        className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {city.name}
                            {city.state && `, ${city.state}`}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {city.country}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
