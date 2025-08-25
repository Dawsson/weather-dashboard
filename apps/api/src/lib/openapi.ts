import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { appRouter } from '../routers';

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export const spec = await generator.generate(appRouter, {
  info: {
    title: 'Weather Dashboard API',
    version: '1.0.0',
    description: 'A comprehensive weather dashboard API providing real-time weather data, city search, and user favorites management. Built with Hono and ORPC for type-safe, contract-first development.',
    contact: {
      name: 'Weather Dashboard',
      url: 'https://github.com/dawsson/weather-dashboard'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/rpc',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'System health and status endpoints'
    },
    {
      name: 'Weather',
      description: 'Weather data and city search operations'
    },
    {
      name: 'User Favorites',
      description: 'Manage user favorite cities (requires authentication)'
    }
  ]
});
