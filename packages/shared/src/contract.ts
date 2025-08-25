import { oc } from '@orpc/contract';
import { z } from 'zod';
import { ZodUser } from './types';

const WeatherConditionSchema = z.object({
  id: z.number().describe('Weather condition ID'),
  main: z.string().describe('Group of weather parameters (Rain, Snow, Clouds, etc.)'),
  description: z.string().describe('Weather condition description (e.g., "light rain", "clear sky")'),
  icon: z.string().describe('Weather icon ID for display'),
});

const CurrentWeatherSchema = z.object({
  dt: z.number().describe('Current time (Unix timestamp, UTC)'),
  sunrise: z.number().optional().describe('Sunrise time (Unix timestamp, UTC)'),
  sunset: z.number().optional().describe('Sunset time (Unix timestamp, UTC)'),
  temp: z.number().describe('Temperature in Celsius'),
  feels_like: z.number().describe('Perceived temperature in Celsius'),
  pressure: z.number().describe('Atmospheric pressure in hPa'),
  humidity: z.number().describe('Humidity percentage'),
  dew_point: z.number().describe('Dew point temperature in Celsius'),
  uvi: z.number().describe('UV index'),
  clouds: z.number().describe('Cloudiness percentage'),
  visibility: z.number().optional().describe('Visibility in meters'),
  wind_speed: z.number().describe('Wind speed in m/s'),
  wind_deg: z.number().describe('Wind direction in degrees'),
  wind_gust: z.number().optional().describe('Wind gust speed in m/s'),
  rain: z.object({ '1h': z.number().describe('Rain volume for last hour in mm') }).optional().describe('Rain data'),
  snow: z.object({ '1h': z.number().describe('Snow volume for last hour in mm') }).optional().describe('Snow data'),
  weather: z.array(WeatherConditionSchema).describe('Weather conditions'),
});

const WeatherAlertSchema = z.object({
  sender_name: z.string().describe('Name of the alert sender/organization'),
  event: z.string().describe('Alert event name (e.g., "Flood Warning")'),
  start: z.number().describe('Alert start time (Unix timestamp, UTC)'),
  end: z.number().describe('Alert end time (Unix timestamp, UTC)'),
  description: z.string().describe('Detailed alert description'),
  tags: z.array(z.string()).describe('Alert category tags'),
});

const WeatherDataSchema = z.object({
  lat: z.number().describe('Latitude of the location'),
  lon: z.number().describe('Longitude of the location'),
  timezone: z.string().describe('Timezone identifier (e.g., "America/New_York")'),
  timezone_offset: z.number().describe('Timezone offset in seconds from UTC'),
  current: CurrentWeatherSchema.describe('Current weather conditions'),
  alerts: z.array(WeatherAlertSchema).optional().describe('Active weather alerts (if any)'),
  name: z.string().describe('Location name (city)'),
  country: z.string().describe('Country code (ISO 3166-1 alpha-2)'),
  state: z.string().optional().describe('State/province name (if applicable)'),
});

const CitySchema = z.object({
  id: z.string().describe('Unique city identifier (lat_lon format)'),
  name: z.string().describe('City name'),
  local_names: z.record(z.string(), z.string()).optional().describe('City names in different languages'),
  lat: z.number().describe('Latitude coordinate'),
  lon: z.number().describe('Longitude coordinate'),
  country: z.string().describe('Country code (ISO 3166-1 alpha-2)'),
  state: z.string().optional().describe('State/province name (if applicable)'),
});

const FavoriteCitySchema = z.object({
  id: z.string().describe('Unique city identifier (lat_lon format)'),
  name: z.string().describe('City name'),
  country: z.string().describe('Country code (ISO 3166-1 alpha-2)'),
  state: z.string().optional().describe('State/province name (if applicable)'),
  lat: z.number().describe('Latitude coordinate'),
  lon: z.number().describe('Longitude coordinate'),
  addedAt: z.date().describe('Date when city was added to favorites'),
});

export const contract = {
  healthCheck: oc
    .route({
      method: 'GET',
      path: '/health',
      summary: 'Health Check',
      description: 'Check the API server health status and current user session',
      tags: ['Health'],
    })
    .output(
      z.object({
        message: z.string().describe('Health status message'),
        user: ZodUser.optional().describe('Current authenticated user information'),
      })
    ),


  users: {
    favorites: {
      getFavorites: oc
        .route({
          method: 'GET',
          path: '/users/favorites',
          summary: 'Get Favorite Cities',
          description: 'Retrieve the authenticated user\'s list of favorite cities',
          tags: ['User Favorites'],
        })
        .output(z.array(FavoriteCitySchema).describe('List of user\'s favorite cities')),

      addFavorite: oc
        .route({
          method: 'POST',
          path: '/users/favorites',
          summary: 'Add Favorite City',
          description: 'Add a city to the authenticated user\'s favorites list (max 20 cities)',
          tags: ['User Favorites'],
        })
        .input(
          z.object({
            id: z.string().describe('Unique city identifier (lat_lon format)'),
            name: z.string().describe('City name'),
            country: z.string().describe('Country code (ISO 3166-1 alpha-2)'),
            state: z.string().optional().describe('State/province name (if applicable)'),
            lat: z.number().describe('Latitude coordinate'),
            lon: z.number().describe('Longitude coordinate'),
          })
        )
        .output(z.boolean().describe('True if city was successfully added to favorites')),

      removeFavorite: oc
        .route({
          method: 'DELETE',
          path: '/users/favorites/{cityId}',
          summary: 'Remove Favorite City',
          description: 'Remove a city from the authenticated user\'s favorites list',
          tags: ['User Favorites'],
        })
        .input(z.object({ 
          cityId: z.string().describe('Unique city identifier to remove from favorites')
        }))
        .output(z.boolean().describe('True if city was successfully removed from favorites')),
    },
  },

  weather: {
    getCurrentWeather: oc
      .route({
        method: 'GET',
        path: '/weather/current',
        summary: 'Get Current Weather',
        description: 'Retrieve current weather conditions for specific coordinates. Data is cached for 1 hour to optimize performance.',
        tags: ['Weather'],
      })
      .input(
        z.object({
          lat: z.number().min(-90).max(90).describe('Latitude coordinate (-90 to 90)'),
          lon: z.number().min(-180).max(180).describe('Longitude coordinate (-180 to 180)'),
        })
      )
      .output(WeatherDataSchema.describe('Complete weather data including current conditions, location details, and optional alerts')),

    searchCities: oc
      .route({
        method: 'GET',
        path: '/weather/search',
        summary: 'Search Cities',
        description: 'Search for cities by name using OpenWeatherMap geocoding API. Results are cached for 24 hours.',
        tags: ['Weather'],
      })
      .input(
        z.object({
          query: z.string().min(1).max(100).describe('City name to search for (minimum 1 character)'),
          limit: z.number().min(1).max(10).optional().default(5).describe('Maximum number of results to return (1-10, default: 5)'),
        })
      )
      .output(z.array(CitySchema).describe('Array of cities matching the search query')),
  },
};
