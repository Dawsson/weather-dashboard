'use client';

import { Button } from '@repo/ui/components/button';
import { useTemperatureUnit } from '@/hooks/use-temperature-unit';

export function TemperatureUnitToggle() {
  const { unit, setUnit } = useTemperatureUnit();

  return (
    <div className="inline-flex rounded-md border bg-background">
      <Button
        className="h-8 px-2 text-xs"
        onClick={() => setUnit('C')}
        size="sm"
        variant={unit === 'C' ? 'default' : 'ghost'}
      >
        °C
      </Button>
      <Button
        className="h-8 px-2 text-xs"
        onClick={() => setUnit('F')}
        size="sm"
        variant={unit === 'F' ? 'default' : 'ghost'}
      >
        °F
      </Button>
    </div>
  );
}
