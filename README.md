# Weather Dashboard

A modern full-stack weather dashboard application that allows users to search for cities worldwide and view current weather conditions. Built with TypeScript, featuring real-time weather data, user authentication, and favorite cities management.

## Features

### Core Weather Functionality
- **Real-time Weather Data** - Current conditions from OpenWeatherMap API
- **Smart City Search** - Debounced search with autocomplete suggestions
- **Favorite Cities** - Save and manage your favorite locations
- **Dual Temperature Units** - Toggle between Celsius and Fahrenheit
- **Responsive Design** - Mobile-first responsive interface

### Technical Features
- **TypeScript** - Full type safety across the stack
- **Next.js 15** - Modern React framework with App Router
- **Hono + ORPC** - Type-safe API with contract-first development
- **Better Auth** - Secure authentication with session management
- **MongoDB + Mongoose** - Document database with type-safe schemas
- **Redis Caching** - Smart caching for weather data and geocoding
- **shadcn/ui** - Beautiful, accessible UI components
- **Docker Ready** - Containerized for easy deployment

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime
- [MongoDB](https://www.mongodb.com/) database
- [Redis](https://redis.io/) for caching
- [OpenWeatherMap API key](https://openweathermap.org/api)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure all required variables (see Environment Variables section below).

4. **Start development servers**
   ```bash
   bun dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001)
   - **API Documentation**: [http://localhost:3001/docs](http://localhost:3001/docs) (Interactive Scalar UI)

### Using Docker

```bash
# Start with docker-compose
docker-compose up --build

# Access the application at http://localhost:3000
```

## Project Structure

```
weather-dashboard/
├── apps/
│   ├── web/                    # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components  
│   │   │   └── utils/         # ORPC client setup
│   │   └── Dockerfile
│   └── api/                    # Hono backend with ORPC
│       ├── src/
│       │   ├── features/      # Feature-based API modules
│       │   ├── lib/           # Shared utilities
│       │   └── routers/       # ORPC route definitions
│       └── Dockerfile
├── packages/
│   ├── shared/                # Shared types and contracts
│   ├── ui/                    # Shared UI components
│   └── typescript-config/     # TypeScript configurations
└── docker-compose.yml
```

## Available Scripts

**Development:**
- `bun dev` - Start all applications in development mode
- `bun format` - Format code with Ultracite
- `bun lint` - Lint code
- `bun typecheck` - TypeScript checking across monorepo

**Production:**
- `bun build` - Build all applications
- `bun start:web` - Start production web server
- `bun start:api` - Start production API server

## Environment Variables

All environment variables are validated using Zod schemas. Copy `.env.example` to `.env` and configure:

### Required Variables

**Database & Caching:**
- `DATABASE_URL` - MongoDB connection string
- `REDIS_URL` - Redis connection string for caching

**Authentication:**
- `BETTER_AUTH_SECRET` - Secret for auth sessions (generate with `openssl rand -base64 32`)

**Weather API:**
- `OPENWEATHERMAP_API_KEY` - API key from [OpenWeatherMap](https://openweathermap.org/api)

**Application URLs:**
- `NEXT_PUBLIC_WEBSITE_URL` - Frontend URL (dev: `http://localhost:3000`)
- `NEXT_PUBLIC_API_URL` - Backend URL (dev: `http://localhost:3001`)
- `NEXT_PUBLIC_PROJECT_NAME` - Application name for branding
- `NEXT_PUBLIC_HOSTNAME` - Application hostname
- `NEXT_PUBLIC_NODE_ENV` - Environment (`development` or `production`)

### Optional Variables (Production)
- `AZURE_COMMUNICATION_CONNECTION_STRING` - For email notifications
- `EMAIL_FROM` - From address for system emails

## API Documentation

The API provides comprehensive OpenAPI documentation with interactive Scalar UI:

- **Interactive API Documentation**: [http://localhost:3001/docs](http://localhost:3001/docs)
- **OpenAPI JSON Specification**: [http://localhost:3001/openapi.json](http://localhost:3001/openapi.json)

The interactive documentation includes:
- Complete endpoint documentation organized by feature (Health, Weather, User Favorites)
- Request/response schemas with detailed field descriptions
- Authentication requirements and examples
- Live API testing interface

### Key API Endpoints

**Weather:**
- `GET /weather/current` - Get current weather for coordinates
- `GET /weather/search` - Search cities by name

**Favorites:**
- `GET /users/favorites` - Get user's favorite cities
- `POST /users/favorites` - Add city to favorites
- `DELETE /users/favorites/{id}` - Remove from favorites

**Authentication:**
- `POST /auth/sign-up` - Create new account
- `POST /auth/sign-in` - Sign in to account
- `POST /auth/sign-out` - Sign out

## Architecture

### Frontend (Next.js 15)
- **App Router** with TypeScript
- **ORPC Client** for type-safe API calls
- **shadcn/ui** components with Tailwind CSS
- **Better Auth** React client for authentication
- **Responsive design** with mobile-first approach

### Backend (Hono + ORPC)
- **Contract-first API** development with ORPC
- **Feature-based architecture** in `/src/features/`
- **Better Auth** for session management
- **Redis caching** for weather data (1 hour) and geocoding (24 hours)
- **Zod validation** for all inputs and environment variables

### Database & Caching
- **MongoDB** with Mongoose ODM for user data and favorites
- **Redis** for intelligent caching of API responses
- **Type-safe schemas** with Zod integration

### Deployment
- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **Environment variable validation** prevents runtime errors

## Development Guidelines

This project follows modern full-stack development patterns:

- **Type Safety**: End-to-end TypeScript with ORPC contracts
- **Error Handling**: Graceful error boundaries and API error responses  
- **Performance**: Smart caching and optimized React rendering
- **Security**: Input validation, secure authentication, and environment variable protection
- **Code Quality**: Ultracite formatting, TypeScript strict mode, and monorepo architecture
