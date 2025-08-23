import { z } from 'zod';

// Weather condition schema
export const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

// Current weather data schema
export const CurrentWeatherSchema = z.object({
  dt: z.number(),
  sunrise: z.number().optional(),
  sunset: z.number().optional(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number().optional(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number().optional(),
  rain: z
    .object({
      '1h': z.number(),
    })
    .optional(),
  snow: z
    .object({
      '1h': z.number(),
    })
    .optional(),
  weather: z.array(WeatherConditionSchema),
});

// Weather alert schema
export const WeatherAlertSchema = z.object({
  sender_name: z.string(),
  event: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
});

// Complete weather data response schema
export const WeatherDataSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: CurrentWeatherSchema,
  alerts: z.array(WeatherAlertSchema).optional(),
});

// City search result schema
export const CitySchema = z.object({
  id: z.string(), // format: "lat_lon"
  name: z.string(),
  local_names: z.record(z.string(), z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

// Favorite city schema (for user storage)
export const FavoriteCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  state: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
  addedAt: z.date(),
});

// Input schemas for API endpoints
export const WeatherRequestSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const CitySearchRequestSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().min(1).max(10).default(5),
});

// Types
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type City = z.infer<typeof CitySchema>;
export type FavoriteCity = z.infer<typeof FavoriteCitySchema>;
export type WeatherRequest = z.infer<typeof WeatherRequestSchema>;
export type CitySearchRequest = z.infer<typeof CitySearchRequestSchema>;
