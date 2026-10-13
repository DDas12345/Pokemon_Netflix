# Pokéflix

Pokéflix is a Pokémon-inspired streaming app that blends a Netflix-style interface with Pokémon discovery, personalization, and tracking. Users can browse Pokémon, add favourites to a watchlist, rate titles, and keep a personal viewing history while exploring the Pokédex through a modern React frontend and Express API.

![Pokéflix Banner](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png)

## Features

- Secure authentication with JWT and cookie-based sessions
- Netflix-inspired home screen with featured Pokémon banner and rows
- Browse Pokémon by type and discover favorites quickly
- Personalized watchlist and continue-watching history
- 1–5 star ratings stored in SQLite
- Detailed Pokémon information pages with stats, types, and metadata
- Responsive dark UI styled with Tailwind CSS

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, JWT, bcrypt, Helmet, express-rate-limit |
| Database | SQLite with better-sqlite3 |
| Data source | PokéAPI |

## Project Structure

```text
Pokéflix/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── historyController.js
│   │   │   ├── ratingsController.js
│   │   │   └── watchlistController.js
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   ├── migrate.js
│   │   │   └── migrations/
│   │   │       ├── 001_create_users.sql
│   │   │       ├── 002_create_sessions.sql
│   │   │       ├── 003_create_watchlist.sql
│   │   │       ├── 004_create_watch_history.sql
│   │   │       └── 005_create_ratings.sql
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── history.js
│   │   │   ├── ratings.js
│   │   │   └── watchlist.js
│   │   └── index.js
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── pokeflix.db
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PokemonCard.jsx
│   │   │   ├── PokemonModal.jsx
│   │   │   ├── PokemonRow.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── StatBar.jsx
│   │   │   └── TypeBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── usePokemon.js
│   │   │   └── useWatchlist.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyListPage.jsx
│   │   │   ├── PokemonDetailPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── App.jsx (if present in your local branch)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
├── package.json
├── README.md
└── .gitignore
```

> Note: the exact frontend structure can vary slightly depending on the branch or local setup, but the core app logic is centered in the React pages and reusable UI components shown above.

## Getting Started

### Prerequisites

- Node.js 18+ (verified on Node 18, 20, 22, and 24)
- npm 9+

### 1. Install dependencies

```bash
cd Pokéflix
npm run install:all
```

This installs dependencies for the root project, backend, and frontend.

### 2. Configure the environment

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Then update the values in `backend/.env`:

```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Set up the database

```bash
npm run migrate
```

This runs the SQLite migrations and creates the local database file in `backend/pokeflix.db`.

### 4. Run the app

```bash
npm run dev
```

This starts:

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## API Overview

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a secure session |
| POST | `/api/auth/logout` | Log out and clear cookies |
| GET | `/api/auth/me` | Get the currently logged-in user |

### Watchlist

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/watchlist` | Get the user’s saved Pokémon |
| POST | `/api/watchlist` | Add a Pokémon to the watchlist |
| DELETE | `/api/watchlist/:pokemonId` | Remove a Pokémon |
| GET | `/api/watchlist/check/:pokemonId` | Check if a Pokémon is already saved |

### Watch History

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/history` | Get the user’s continue-watching history |
| POST | `/api/history` | Record a watch event |

### Ratings

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/ratings/:pokemonId` | Get the current user’s rating |
| GET | `/api/ratings/:pokemonId/average` | Get the average rating |
| POST | `/api/ratings` | Create or update a rating |

## Useful commands

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only the backend
npm run dev:backend

# Start only the frontend
npm run dev:frontend

# Run backend migrations
npm run migrate

# Create a production build for the frontend
npm run build

# Start the backend in production mode
npm start
```

## Notes

- The app uses the PokéAPI for Pokémon data and metadata.
- The SQLite database is created locally and persists on disk in the backend folder.
- The backend includes rate limiting and CORS protection for local development when served from the Vite frontend.

## License

MIT
