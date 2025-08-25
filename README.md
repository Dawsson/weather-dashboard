# Weather Dashboard

Search cities worldwide and view current weather conditions. Save your favorite locations and toggle between temperature units.

## Setup

**Prerequisites:** Bun, MongoDB, Redis, OpenWeatherMap API key

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URLs
   ```

3. **Start development**
   ```bash
   bun dev
   ```

4. **Open app**
   - App: [http://localhost:3000](http://localhost:3000)
   - API docs: [http://localhost:3001/docs](http://localhost:3001/docs)

## Scripts

- `bun dev` - Start development
- `bun format` - Format code
- `bun build` - Build for production

## Environment Variables

Required variables in `.env`:

- `DATABASE_URL` - MongoDB connection
- `REDIS_URL` - Redis connection  
- `OPENWEATHERMAP_API_KEY` - Weather API key
- `BETTER_AUTH_SECRET` - Auth secret

## API Endpoints

**Weather:**
- `GET /weather/current` - Get current weather for coordinates
- `GET /weather/search` - Search cities by name

**Favorites:**
- `GET /users/favorites` - Get user's favorite cities
- `POST /users/favorites` - Add city to favorites
- `DELETE /users/favorites/{id}` - Remove from favorites
