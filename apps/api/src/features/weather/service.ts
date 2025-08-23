import fetch from 'node-fetch';
import { env } from '@/env';
import { redis } from '@/lib/redis';
import type {
  City,
  CitySearchRequest,
  WeatherData,
  WeatherRequest,
} from './schema';

export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org';
  private readonly apiKey = env.OPENWEATHERMAP_API_KEY;

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather({ lat, lon }: WeatherRequest): Promise<WeatherData> {
    console.log('Getting current weather for:', lat, lon);

    const cacheKey = `weather:v2:${lat.toFixed(4)}:${lon.toFixed(4)}`;

    try {
      // Check cache first (1 hour TTL)
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('Returning cached weather data');
        return JSON.parse(cached) as WeatherData;
      }

      // Fetch from OpenWeatherMap Current Weather API (completely free)
      const url = `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

      console.log('Making request to:', url);
      const response = await fetch(url);

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);

        if (response.status === 401) {
          throw new Error('Invalid OpenWeatherMap API key');
        }
        if (response.status === 404) {
          throw new Error('Location not found');
        }
        throw new Error(
          `Weather API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const rawData = (await response.json()) as any;

      console.log(
        'OpenWeather API Response:',
        JSON.stringify(rawData, null, 2)
      );

      // Transform current weather API response to our schema
      const data: WeatherData = {
        lat: Number(rawData.coord.lat),
        lon: Number(rawData.coord.lon),
        timezone: 'UTC', // Current weather API doesn't provide timezone
        timezone_offset: 0, // Current weather API doesn't provide timezone offset
        current: {
          dt: Number(rawData.dt),
          sunrise: rawData.sys?.sunrise
            ? Number(rawData.sys.sunrise)
            : undefined,
          sunset: rawData.sys?.sunset ? Number(rawData.sys.sunset) : undefined,
          temp: Number(rawData.main.temp),
          feels_like: Number(rawData.main.feels_like),
          pressure: Number(rawData.main.pressure),
          humidity: Number(rawData.main.humidity),
          dew_point: Number(rawData.main.temp), // Approximate with temp since not available
          uvi: 0, // Current weather API doesn't provide UV index
          clouds: Number(rawData.clouds?.all || 0),
          visibility: rawData.visibility
            ? Number(rawData.visibility)
            : undefined,
          wind_speed: Number(rawData.wind?.speed || 0),
          wind_deg: Number(rawData.wind?.deg || 0),
          wind_gust: rawData.wind?.gust ? Number(rawData.wind.gust) : undefined,
          rain: rawData.rain
            ? { '1h': Number(rawData.rain['1h'] || 0) }
            : undefined,
          snow: rawData.snow
            ? { '1h': Number(rawData.snow['1h'] || 0) }
            : undefined,
          weather: Array.isArray(rawData.weather) ? rawData.weather : [],
        },
      };

      // Cache for 1 hour (3600 seconds)
      await redis.setex(cacheKey, 3600, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);

      // Try to return stale cached data if API fails
      const staleKey = `weather:stale:${lat.toFixed(4)}:${lon.toFixed(4)}`;
      const staleData = await redis.get(staleKey);
      if (staleData) {
        console.log('Returning stale weather data due to API failure');
        return JSON.parse(staleData) as WeatherData;
      }

      throw error;
    }
  }

  /**
   * Search for cities using geocoding API
   */
  async searchCities({ query, limit = 5 }: CitySearchRequest): Promise<City[]> {
    const cacheKey = `geocoding:${query.toLowerCase()}:${limit}`;

    try {
      // Check cache first (24 hour TTL for geocoding)
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as City[];
      }

      // Fetch from OpenWeatherMap Geocoding API
      const url = `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid OpenWeatherMap API key');
        }
        throw new Error(
          `Geocoding API error: ${response.status} ${response.statusText}`
        );
      }

      const rawData = (await response.json()) as any[];

      // Transform to our schema format
      const cities: City[] = rawData.map((item) => ({
        id: `${item.lat.toFixed(4)}_${item.lon.toFixed(4)}`,
        name: item.name,
        local_names: item.local_names,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));

      // Cache for 24 hours (86400 seconds)
      await redis.setex(cacheKey, 86_400, JSON.stringify(cities));

      return cities;
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }

  /**
   * Get weather data for multiple locations (for batch requests)
   */
  async getBatchWeather(locations: WeatherRequest[]): Promise<WeatherData[]> {
    const promises = locations.map((location) =>
      this.getCurrentWeather(location)
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching batch weather data:', error);
      throw error;
    }
  }
}
