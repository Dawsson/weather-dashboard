import { expect, test } from "bun:test";

test("temperature unit toggle logic", () => {
  const toggleLogic = (unit: 'C' | 'F') => unit === 'C' ? 'F' : 'C';
  
  expect(toggleLogic('C')).toBe('F');
  expect(toggleLogic('F')).toBe('C');
});

test("temperature unit validation", () => {
  const isValidUnit = (unit: string): unit is 'C' | 'F' => {
    return unit === 'C' || unit === 'F';
  };
  
  expect(isValidUnit('C')).toBe(true);
  expect(isValidUnit('F')).toBe(true);
  expect(isValidUnit('K')).toBe(false);
  expect(isValidUnit('')).toBe(false);
});

test("localStorage unit handling", () => {
  const parseStoredUnit = (stored: string | null): 'C' | 'F' => {
    if (stored === 'C' || stored === 'F') {
      return stored;
    }
    return 'C'; // default
  };
  
  expect(parseStoredUnit('C')).toBe('C');
  expect(parseStoredUnit('F')).toBe('F');
  expect(parseStoredUnit(null)).toBe('C');
  expect(parseStoredUnit('invalid')).toBe('C');
});