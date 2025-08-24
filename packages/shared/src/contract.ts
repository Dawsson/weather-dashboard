import { oc } from '@orpc/contract';
import { z } from 'zod';
import { ZodUser } from './types';

const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const CurrentWeatherSchema = z.object({
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
  rain: z.object({ '1h': z.number() }).optional(),
  snow: z.object({ '1h': z.number() }).optional(),
  weather: z.array(WeatherConditionSchema),
});

const WeatherAlertSchema = z.object({
  sender_name: z.string(),
  event: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
});

const WeatherDataSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: CurrentWeatherSchema,
  alerts: z.array(WeatherAlertSchema).optional(),
});

const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  local_names: z.record(z.string(), z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

const FavoriteCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  state: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
  addedAt: z.date(),
});

export const contract = {
  healthCheck: oc
    .route({
      method: 'GET',
      path: '/health',
    })
    .output(
      z.object({
        message: z.string(),
        user: ZodUser.optional(),
      })
    ),

  counting: {
    getCount: oc
      .route({
        method: 'GET',
        path: '/count',
      })
      .output(z.number()),

    increment: oc.output(z.number()),
    decrement: oc.output(z.number()),
  },

  users: {
    favorites: {
      getFavorites: oc.output(z.array(FavoriteCitySchema)),

      addFavorite: oc
        .input(
          z.object({
            id: z.string(),
            name: z.string(),
            country: z.string(),
            state: z.string().optional(),
            lat: z.number(),
            lon: z.number(),
          })
        )
        .output(z.boolean()),

      removeFavorite: oc
        .input(z.object({ cityId: z.string() }))
        .output(z.boolean()),

      reorderFavorites: oc
        .input(z.object({ cityIds: z.array(z.string()) }))
        .output(z.boolean()),

      clearFavorites: oc.output(z.boolean()),
    },
  },

  weather: {
    getCurrentWeather: oc
      .route({
        method: 'GET',
        path: '/weather/current',
      })
      .input(
        z.object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(-180).max(180),
        })
      )
      .output(WeatherDataSchema),

    searchCities: oc
      .route({
        method: 'GET',
        path: '/weather/search',
      })
      .input(
        z.object({
          query: z.string().min(1).max(100),
          limit: z.number().min(1).max(10).optional().default(5),
        })
      )
      .output(z.array(CitySchema)),

    getBatchWeather: oc
      .input(
        z.array(
          z.object({
            lat: z.number().min(-90).max(90),
            lon: z.number().min(-180).max(180),
          })
        )
      )
      .output(z.array(WeatherDataSchema)),
  },
};
