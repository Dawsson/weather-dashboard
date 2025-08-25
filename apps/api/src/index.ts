import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from '@/env';
import { auth } from '@/lib/auth';
import { spec } from '@/lib/openapi';
import { createContext } from './lib/context';
import { appRouter } from './routers/index';

const router = new Hono();
const handler = new OpenAPIHandler(appRouter, {
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

router.use(logger());

// Better Auth specific CORS configuration (must come before general CORS)
router.use(
  '/api/auth/*',
  cors({
    origin: env.NEXT_PUBLIC_WEBSITE_URL,
    credentials: true,
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'Set-Cookie',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Set-Cookie'],
    maxAge: 600,
  })
);

// RPC-specific CORS with credentials
router.use(
  '/rpc/*',
  cors({
    origin:
      env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://localhost:3001']
        : [env.NEXT_PUBLIC_WEBSITE_URL, env.NEXT_PUBLIC_API_URL],
    credentials: true,
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'Set-Cookie',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Set-Cookie'],
    maxAge: 600,
  })
);

// General CORS for non-auth routes
router.use(
  '*',
  cors({
    origin: env.NEXT_PUBLIC_WEBSITE_URL,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Better Auth routes
router.on(['POST', 'GET', 'PUT', 'DELETE'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

router.use('/rpc/*', async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

router.get('/docs', Scalar({ url: `${env.NEXT_PUBLIC_API_URL}/openapi.json` }));
router.get('/openapi.json', (c) => {
  return c.json(spec);
});

router.get('/', (c) => {
  return c.text('OK');
});

Bun.serve({
  fetch: router.fetch,
  port: 3001,
});
