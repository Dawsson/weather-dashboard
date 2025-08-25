'use client';

import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { orpc } from '@/utils/orpc-client';

interface FavoritesSectionProps {
  onCitySelect?: (city: {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
  }) => void;
}

export function FavoritesSection({ onCitySelect }: FavoritesSectionProps) {
  const { data: user } = authClient.useSession();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery(
    orpc.users.favorites.getFavorites.queryOptions({
      enabled: !!user,
      staleTime: 2 * 60 * 1000, // 2 minutes
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

  const handleCityClick = (city: any) => {
    if (onCitySelect) {
      onCitySelect({
        lat: city.lat,
        lon: city.lon,
        name: city.name,
        country: city.country,
        state: city.state,
      });
    }
  };

  const handleRemoveFavorite = (e: React.MouseEvent, cityId: string) => {
    e.stopPropagation();
    removeFavoriteMutation.mutate({ cityId });
  };

  if (!user || favorites.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 fill-current text-red-500" />
          Favorite Cities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((city) => (
            <div
              className="group relative cursor-pointer rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
              key={city.id}
              onClick={() => handleCityClick(city)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{city.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {city.state && `${city.state}, `}
                      {city.country}
                    </p>
                  </div>
                </div>
                <Button
                  className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={removeFavoriteMutation.isPending}
                  onClick={(e) => handleRemoveFavorite(e, city.id)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
