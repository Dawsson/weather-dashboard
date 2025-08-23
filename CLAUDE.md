# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Falcon CLI is REQUIRED

**DO NOT RUN ANY COMMANDS WITHOUT FALCON CLI**

- NEVER use: `bun run dev`, `bun install`, `npm run`, etc.
- ALWAYS use: `falcon dev`, `falcon run bun install`, `falcon run npm run`, etc.
- ALWAYS run from directory with `falcon.json` file
- ALWAYS use tmux session named "dev" for development

## Critical Falcon CLI Usage

**IMPORTANT: NEVER run commands directly. ALWAYS use the Falcon CLI to ensure environment variables are properly injected.**

### The falcon.json File

Every project must have a `falcon.json` file in the root directory:

```json
{
  "project": "ProjectName"
}
```

The Falcon CLI commands **MUST** be run from the directory containing `falcon.json` or its subdirectories.

### Development Workflow

**ALWAYS use tmux for development** - This provides better visibility and control over the development server.

#### Using tmux MCP Server (Recommended for AI Assistants)

When using Claude Code or other AI assistants with tmux MCP server:

```bash
# Create session
mcp__tmux__create-session --name "dev"

# Start development server
mcp__tmux__execute-command --paneId "%0" --command "cd /path/to/project && falcon dev"
```

To stop the development server, use the Bash tool to send Ctrl+C:
```bash
tmux send-keys -t dev:0 C-c
```

#### Manual tmux Setup

For manual development without AI assistance:

```bash
# Create or attach to dev session
tmux new-session -d -s dev || tmux attach -t dev

# Start development server (runs both API and web)
tmux send-keys -t dev:0 'cd $(pwd) && falcon dev' C-m

# Attach to session
tmux attach -t dev
```

**Note**: `falcon dev` runs all services together. Use Ctrl+C to stop.

### Running Commands with Environment Variables

**Use `falcon run` ONLY when commands need environment variables from Falcon:**

```bash
# Commands that NEED falcon run (require env vars):
falcon dev                                   # Development server needs DATABASE_URL, etc.
falcon run bun run dev --filter=@repo/api    # API needs env vars
falcon run bun run dev --filter=@repo/web    # Web app needs NEXT_PUBLIC_* vars
falcon run bun start:api                     # Production API
falcon run bun start:web                     # Production web

# Commands that DON'T need falcon run (no env vars required):
bun install                                  # Installing dependencies
bun format                                   # Format and fix code with Ultracite
bun lint                                     # Check code with Ultracite
bun typecheck                                # TypeScript checking
bun build                                    # Building (unless it needs env vars)
```

The `falcon run` command:
- Injects all environment variables from your Falcon project
- Ensures consistent environment across all commands that need env vars
- Tracks command execution for billing/activity

### Common Commands

```bash
# Commands that NEED falcon run (environment variables required):
falcon dev                                   # Start all apps together
falcon run bun run dev --filter=@repo/api    # Backend dev server only
falcon run bun run dev --filter=@repo/web    # Frontend dev server only
falcon run bun start:api                     # Production API
falcon run bun start:web                     # Production web

# Commands that DON'T need falcon run:
bun install                                  # Install dependencies
bun format                                   # Format and fix code with Ultracite
bun lint                                     # Check code with Ultracite
bun typecheck                                # Type check all apps
bun build                                    # Build all apps
```

### Why This Matters

1. **Environment Variables**: The Falcon CLI automatically injects all project environment variables
2. **Consistency**: Ensures all developers and AI assistants use the same environment
3. **Security**: Keeps sensitive env vars in Falcon, not in local .env files
4. **Activity Tracking**: Tracks development time and command usage
5. **Project Context**: Commands are aware of the project context via falcon.json

### Task Management (if Discord integration is enabled)

```bash
# List all tasks (from Discord forum posts)
falcon tasks list
falcon tasks list --json             # JSON output for AI/programmatic use

# Create a new task (creates Discord forum post)
falcon tasks create [title] [description]

# Claim an open task
falcon tasks claim

# Release a claimed task
falcon tasks release

# Sync Discord forum posts as tasks
falcon tasks sync
```

### AI Mode

When `CLAUDECODE=1` is set, CLI commands automatically output JSON for better AI integration:

```bash
CLAUDECODE=1 falcon tasks list    # Auto JSON output
CLAUDECODE=1 falcon project        # Auto JSON output
CLAUDECODE=1 falcon env list       # Auto JSON output
```

## Architecture Overview

**Technology Stack**: Turborepo monorepo with Bun runtime, featuring end-to-end TypeScript type safety from MongoDB → Hono/ORPC → Next.js

### Applications Structure
- `apps/api/` - Hono backend with ORPC API layer and Better Auth
- `apps/web/` - Next.js 15 frontend with App Router and shadcn/ui

### Shared Packages
- `packages/shared/` - Shared utilities, types, and ORPC contract (`@repo/shared`)
- `packages/ui/` - Shared shadcn/ui components and Tailwind styles (`@repo/ui`)
- `packages/typescript-config/` - Shared TypeScript configurations (`@repo/typescript-config`)

### Key Architectural Patterns

**ORPC Integration**: 
- Shared contract definition in `packages/shared/src/contract.ts` using `@orpc/contract`
- Server procedures in `apps/api/src/routers/` implement the contract
- Frontend consumes the API with full type inference via `@orpc/tanstack-query`
- Add new routes to contract first, then implement in server router
- Use appropriate middleware (publicProcedure, protectedProcedure)

**Authentication Flow**: 
- Better Auth handles sessions with MongoDB adapter
- Protected procedures check session context via `protectedProcedure` in `apps/api/src/lib/orpc.ts`
- API endpoints support x-api-key header authentication (handled automatically by Better Auth)
- Session cookies use `${PROJECT_NAME}.session_token` format

**Database Models**: 
- Mongoose schemas live in `apps/api/src/db/` and use zod-mongoose for type-safe schema definitions
- Look at existing schemas as references for patterns
- Connection is managed within the API application
- When using `.populate()`, create separate Zod schemas for populated data

**Environment Configuration**: 
- Environment variables are validated using `@t3-oss/env-core` with Zod schemas in `apps/web/src/env.ts` and `apps/api/src/env.ts`
- All apps share variables from root `.env` file
- **Always use `import { env } from '@/env'` for environment access** (never `Bun.env` or `process.env`)
- Required vars include `DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_WEBSITE_URL`, and `NEXT_PUBLIC_API_URL`

## Code Quality Standards

- **Formatter**: Ultracite 5.1.2 (extends Biome 2.1.2) - run `bun format` to lint and format
- **Linting**: Run `bun lint` to check code without fixing
- **Type Checking**: Run `bun typecheck` to check TypeScript types across all apps
- **Imports**: Auto-organized with Biome, TailwindCSS classes are sorted
- **TypeScript**: Strict mode enabled, use path aliases `@/*` for `src/*`
- **Components**: Use shadcn/ui components from `@repo/ui/components/*` or local `@/components/ui`, follow New York variant style
- **Bun Global**: Configured in `biome.jsonc` to recognize Bun runtime variables

## Development Notes

- Frontend communicates with backend via ORPC client configured in `apps/web/src/utils/orpc.ts`
- Auth state is managed through Better Auth React client (`apps/web/src/lib/auth-client.ts`) and TanStack Query
- Database connection uses Mongoose with TypeScript - models should extend proper Mongoose document types
- Build system uses Turbo for parallel task execution across workspace packages
- Middleware handles auth protection and optional 8-digit slug rewriting (`apps/web/src/middleware.ts`)
- API documentation automatically generated at `/docs` using Scalar + OpenAPI integration
- When unsure about newer patterns or libraries, use Context7 to find relevant documentation

## ORPC Modern Client Usage

This codebase uses ORPC with TanStack Query integration for contract-first API development.

### Contract Definition Example
```typescript
// packages/shared/src/contract.ts
export const contract = {
  healthCheck: oc.route({ method: 'GET', path: '/health' }).output(z.string()),
  counting: {
    getCount: oc.route({ method: 'GET', path: '/count' }).output(z.number()),
    increment: oc.output(z.number()),
    decrement: oc.output(z.number()),
  },
};
```

### Server Implementation Example
```typescript
// apps/api/src/routers/index.ts
export const appRouter = {
  healthCheck: publicProcedure.healthCheck.handler(() => 'OK'),
  counting: {
    getCount: publicProcedure.counting.getCount.handler(() => count),
    increment: protectedProcedure.counting.increment.handler(() => ++count),
    decrement: protectedProcedure.counting.decrement.handler(() => --count),
  },
};
```

### Server Usage (App Router)
```typescript
// apps/web/src/app/(main)/page.tsx
import { Increment } from "@/app/_components/increment";
import { orpc } from "@/utils/orpc";

export default async function Home() {
    const count = await orpc.counting.getCount.call();

    return (
        <div>
            <div>Server count: {count}</div>
            <Increment />
        </div>
    );
}
```

### Client Component Usage
```typescript
// apps/web/src/app/_components/increment.tsx
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { orpc, queryClient } from "@/utils/orpc";

export function Increment() {
    const { data: count } = useQuery(orpc.counting.getCount.queryOptions());

    const increment = useMutation(
        orpc.counting.increment.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.counting.getCount.key(),
                });
            },
        })
    );

    return (
        <div className="border">
            <div>Client count: {count}</div>
            <Button onClick={() => increment.mutateAsync({})} type="button">
                Increment
            </Button>
        </div>
    );
}
```

### Available Methods

**queryOptions** - For queries
```typescript
const queryOptions = orpc.path.to.query.queryOptions(
  { /* input */ },
  { staleTime: 1000 } // Native TanStack Query options
);
// Pass to useQuery, useSuspenseQuery, or queryClient methods
```

**mutationOptions** - For mutations
```typescript
const mutationOptions = orpc.path.to.mutation.mutationOptions({
  onSuccess: (data) => { /* handle success */ }
});
// Pass to useMutation
```

**key** - Access query keys for cache manipulation
```typescript
const queryKey = orpc.path.to.query.key();
// Use with queryClient.invalidateQueries({ queryKey: orpc.counting.getCount.key() });
```

### Type Inference
```typescript
import type { inferInput, inferOutput } from '@orpc/tanstack-query';

function Component() {
  type Input = inferInput<typeof orpc.path.to.procedure>;
  type Output = inferOutput<typeof orpc.path.to.procedure>;
}
```

## Middleware Configuration

The Next.js middleware (`apps/web/src/middleware.ts`) provides:

**Auth Protection**: Routes in `protectedRoutes` array require authentication, redirecting to login with `?redirect` parameter. Routes in `unauthedOnlyRoutes` redirect authenticated users away.

**Slug Rewriting**: When enabled, 8-digit alphanumeric slugs (e.g., `/abc12345`) are rewritten to `/x/abc12345` format. Configure via `MIDDLEWARE_CONFIG.enableSlugRewriting` and `slugRewritingPath`.

**Better Auth Integration**: Session validation uses `${env.NEXT_PUBLIC_PROJECT_NAME}.session_token` cookie. Auth client connects to API at `NEXT_PUBLIC_API_URL` endpoint.

## Git Commits

When asked to commit, always:
1. Run git status and diff to see changes
2. Run git log to match commit style
3. Use concise messages focusing on "why" not "what"
4. Never include co-author information

### Pre-commit Checks

Before committing, ensure code quality by running:
```bash
bun format       # Fix formatting and linting issues with Ultracite
bun typecheck    # Ensure no TypeScript errors
```