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

  async getCurrentWeather({ lat, lon }: WeatherRequest): Promise<WeatherData> {
    console.log('Getting current weather for:', lat, lon);

    const cacheKey = `weather:v2:${lat.toFixed(4)}:${lon.toFixed(4)}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('Returning cached weather data');
        return JSON.parse(cached) as WeatherData;
      }

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

      const data: WeatherData = {
        lat: Number(rawData.coord.lat),
        lon: Number(rawData.coord.lon),
        timezone: 'UTC',
        timezone_offset: 0,
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
          dew_point: Number(rawData.main.temp),
          uvi: 0,
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

      await redis.setex(cacheKey, 3600, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);

      const staleKey = `weather:stale:${lat.toFixed(4)}:${lon.toFixed(4)}`;
      const staleData = await redis.get(staleKey);
      if (staleData) {
        console.log('Returning stale weather data due to API failure');
        return JSON.parse(staleData) as WeatherData;
      }

      throw error;
    }
  }

  async searchCities({ query, limit = 5 }: CitySearchRequest): Promise<City[]> {
    const cacheKey = `geocoding:${query.toLowerCase()}:${limit}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as City[];
      }

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

      const cities: City[] = rawData.map((item) => ({
        id: `${item.lat.toFixed(4)}_${item.lon.toFixed(4)}`,
        name: item.name,
        local_names: item.local_names,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));

      await redis.setex(cacheKey, 86_400, JSON.stringify(cities));

      return cities;
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }

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
