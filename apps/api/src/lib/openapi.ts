import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { appRouter } from '../routers';

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export const spec = await generator.generate(appRouter, {
  info: {
    title: 'Server API',
    version: '1.0.0',
  },
});
