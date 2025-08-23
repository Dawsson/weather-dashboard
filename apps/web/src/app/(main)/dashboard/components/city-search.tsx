'use client';

import { Card } from '@repo/ui/components/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { orpc } from '@/utils/orpc-client';

export function CitySearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Debounce the search query by 300ms
  const [debouncedQuery] = useDebounce(query, 300);

  // Only search when debounced query has at least 3 characters
  const { data: cities = [], isLoading } = useQuery(
    orpc.weather.searchCities.queryOptions({
      input: { query: debouncedQuery, limit: 5 },
      enabled: debouncedQuery.length >= 3,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })
  );

  const addFavoriteMutation = useMutation(
    orpc.users.favorites.addFavorite.mutationOptions({
      onSuccess: () => {
        // Invalidate favorites query to refresh the list
        queryClient.invalidateQueries({
          queryKey: orpc.users.favorites.getFavorites.key(),
        });
        setQuery('');
        setIsOpen(false);
        toast.success('City added to favorites!');
      },
      onError: (error) => {
        if (error.message.includes('already in favorites')) {
          toast.error('This city is already in your favorites');
        } else if (error.message.includes('Maximum')) {
          toast.error('You can only have up to 20 favorite cities');
        } else {
          toast.error('Failed to add city to favorites');
        }
      },
    })
  );

  const handleCitySelect = (city: any) => {
    addFavoriteMutation.mutate({
      id: city.id,
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    });
  };

  useEffect(() => {
    setIsOpen(query.length >= 3);
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <Card>
        <Command shouldFilter={false}>
          <CommandInput
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onFocus={() => setIsOpen(query.length >= 3)}
            onValueChange={setQuery}
            placeholder="Search for a city..."
            value={query}
          />
          {isOpen && (
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : cities.length === 0 && query.length >= 3 ? (
                <CommandEmpty>No cities found.</CommandEmpty>
              ) : cities.length === 0 ? (
                <CommandEmpty>
                  Type at least 3 characters to search
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      className="flex cursor-pointer items-center gap-2"
                      key={city.id}
                      onSelect={() => handleCitySelect(city)}
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
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </Card>
    </div>
  );
}
