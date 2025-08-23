import { publicProcedure } from '@/lib/orpc';
import { WeatherService } from './service';

const weatherService = new WeatherService();

export const weatherRouter = {
  getCurrentWeather: publicProcedure.weather.getCurrentWeather.handler(
    async ({ input }) => {
      return await weatherService.getCurrentWeather(input);
    }
  ),

  searchCities: publicProcedure.weather.searchCities.handler(
    async ({ input }) => {
      return await weatherService.searchCities(input);
    }
  ),

  getBatchWeather: publicProcedure.weather.getBatchWeather.handler(
    async ({ input }) => {
      return await weatherService.getBatchWeather(input);
    }
  ),
};
