'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type TemperatureUnit = 'C' | 'F';

interface TemperatureUnitContext {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
}

const TemperatureUnitContext = createContext<TemperatureUnitContext | null>(null);

export function TemperatureUnitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unit, setUnitState] = useState<TemperatureUnit>('C');

  // Load unit preference from localStorage on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem('temperature-unit') as TemperatureUnit | null;
    if (savedUnit && (savedUnit === 'C' || savedUnit === 'F')) {
      setUnitState(savedUnit);
    }
  }, []);

  // Save unit preference to localStorage when it changes
  const setUnit = (newUnit: TemperatureUnit) => {
    setUnitState(newUnit);
    localStorage.setItem('temperature-unit', newUnit);
  };

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
  };

  return (
    <TemperatureUnitContext.Provider value={{ unit, setUnit, toggleUnit }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnit() {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error('useTemperatureUnit must be used within a TemperatureUnitProvider');
  }
  return context;
}