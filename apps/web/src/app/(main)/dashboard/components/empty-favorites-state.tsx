'use client';

import { Card, CardContent } from '@repo/ui/components/card';
import { MapPin, Search } from 'lucide-react';

export function EmptyFavoritesState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
          <div className="rounded-full bg-muted p-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">No favorite cities yet</h3>
            <p className="max-w-sm text-muted-foreground text-sm">
              Start by searching for a city above to add it to your favorites
              and track its weather.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
            <Search className="h-3 w-3" />
            <span>Use the search box above to find cities</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
