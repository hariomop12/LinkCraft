# LinkCraft

LinkCraft is a full-stack URL shortener project with a React frontend and a Node.js/Express backend. It lets users shorten links instantly, redirect short codes to original URLs, and manage link history after authentication.

This repository looks like an active in-progress build. The app already has a working landing page, public shortening flow, authentication APIs, PostgreSQL-backed persistence, and database migrations. It also contains some duplicate legacy files in the backend, so this README points out the currently active structure and a few known quirks to save time for future contributors.

## What It Does

- Shortens long URLs into shareable short links
- Supports anonymous link shortening from the frontend
- Supports authenticated users with JWT-based auth
- Stores URL records in PostgreSQL
- Redirects short codes to the original destination
- Tracks user-specific URL history and basic click metrics
- Adds rate limiting, request logging, and basic security hardening

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- Lucide React

### Backend

- Node.js
- Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `express-validator`
- `express-rate-limit`
- `morgan` + `winston`

## Project Structure

```text
LinkCraft/
|-- backend/
|   |-- app.js
|   |-- server.js
|   |-- package.json
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- controller.auth.js
|   |   |-- controller.url.js
|   |   |-- authController.js
|   |   `-- urlController.js
|   |-- middleware/
|   |   |-- middleware.auth.js
|   |   `-- middleware.validation.js
|   |-- models/
|   |   |-- modle.user.js
|   |   |-- modle.url.js
|   |   `-- Url.js
|   |-- routes/
|   |   |-- routes.auth.js
|   |   |-- routes.url.js
|   |   |-- authRoutes.js
|   |   `-- urlRoutes.js
|   |-- utils/
|   |   |-- cache.js
|   |   |-- generateShortUrl.js
|   |   `-- logger.js
|   `-- db/migrations/
`-- frontend/
    |-- package.json
    |-- vite.config.js
    |-- public/
    `-- src/
        |-- App.jsx
        |-- main.jsx
        |-- index.css
        |-- assets/
        `-- components/
```

## Active App Flow

### Frontend

The frontend is a single-page landing experience built in React. The `Hero` section takes a long URL, calls the backend public shortening endpoint, and returns a copyable short link.

Primary frontend files:

- `frontend/src/App.jsx` stitches together the layout
- `frontend/src/components/Hero.jsx` handles the URL shortening request
- `frontend/src/components/navbar.jsx`, `Crad.jsx`, and `Fotter.jsx` render the landing page sections

### Backend

The backend entry point is `backend/server.js`. It configures:

- CORS using `FRONTEND_URL`
- JSON/body parsing
- request logging
- rate limiting
- basic security headers
- auth and URL routes
- redirect support for `/u/:shortUrl`

The more complete route/controller chain currently appears to be:

- `backend/routes/routes.auth.js`
- `backend/routes/routes.url.js`
- `backend/controllers/controller.auth.js`
- `backend/controllers/controller.url.js`
- `backend/middleware/middleware.auth.js`
- `backend/middleware/middleware.validation.js`

The repo also contains alternate route/controller files such as `authRoutes.js`, `urlRoutes.js`, `authController.js`, and `urlController.js`. These look like older or parallel implementations and are worth cleaning up later.

## Features

- Anonymous shortening without requiring login
- Authenticated shortening with user association
- Redirect handling via short code
- URL history endpoint for logged-in users
- User statistics in history response
- Request validation for signup and login
- Password hashing with `bcryptjs`
- JWT-based session handling
- PostgreSQL-backed storage
- Landing page UI with copy-to-clipboard support

## API Overview

Base URL during local development is typically:

```text
http://localhost:5000
```

### Health / Root

#### `GET /`

Returns a welcome payload, metadata, and database health information.

#### `GET /health`

Mentioned by the backend welcome response and server logs, but verify implementation before relying on it in production.

### Auth Endpoints

#### `POST /api/auth/signup`

Creates a new user.

Expected body:

```json
{
  "username": "hariom",
  "email": "hariom@example.com",
  "password": "StrongPass1!"
}
```

Validation:

- username must be 3 to 30 alphanumeric characters
- email must be valid
- password must be at least 8 characters and include uppercase, lowercase, number, and special character

#### `POST /api/auth/login`

Logs in a user and returns a JWT.

Current implementation note:

- validation middleware expects `email`
- controller currently reads `identifier`

So the login flow likely needs a small consistency fix before the API is production-ready.

### URL Endpoints

#### `POST /api/url/public/shorten`

Public endpoint for anonymous shortening.

Expected body:

```json
{
  "longUrl": "https://example.com/some/really/long/path"
}
```

Typical response:

```json
{
  "shortUrl": "abc123",
  "fullShortUrl": "http://localhost:5000/u/abc123",
  "longUrl": "https://example.com/some/really/long/path",
  "message": "URL shortened successfully"
}
```

#### `POST /api/url/shorten`

Protected endpoint. Requires:

```text
Authorization: Bearer <jwt-token>
```

Associates the shortened URL with the authenticated user.

#### `GET /api/url/user/history`

Protected endpoint that returns:

- user profile info
- total URL count
- total clicks
- oldest URL metadata
- full list of shortened URLs

#### `GET /api/url/:shortUrl`

Looks up the short code and redirects to the original URL.

#### `GET /u/:shortUrl`

User-friendly redirect route exposed by `server.js`, which forwards to the API redirect flow.

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd LinkCraft
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

If you prefer `pnpm`, the frontend already contains a `pnpm-lock.yaml`.

### 4. Configure environment variables

### Backend `.env`

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
JWT_SECRET=replace_with_a_secure_secret

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 5. Run the backend

```bash
cd backend
npm run dev
```

### 6. Run the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Database Notes

LinkCraft uses PostgreSQL and includes migration files in:

```text
backend/db/migrations/
```

Current migration files:

- `20250313210241_f1.sql`
- `20250313213002_f2.sql`
- `20250314062703_f3.sql`
- `20250314070241_f4.sql`
- `20250314071953_f5.sql`

The schema is centered around users, shortened URLs, and user URL history.

Important note:

- `backend/config/db.js` currently includes a hardcoded CA certificate block for SSL
- that may be correct for the original deployment target, but it makes local DB setup less generic
- if you are running PostgreSQL locally, you may need to adjust the DB config before the app connects cleanly

## Available Scripts

### Backend

From `backend/`:

```bash
npm run dev
npm start
npm run lint
npm run format
npm test
```

What they do:

- `npm run dev` starts the backend with `nodemon`
- `npm start` runs the backend with Node
- `npm run lint` runs ESLint
- `npm run format` formats JS, JSON, and Markdown files
- `npm test` currently prints `No tests configured`

### Frontend

From `frontend/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Example Requests

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"hariom","email":"hariom@example.com","password":"StrongPass1!"}'
```

### Public shorten

```bash
curl -X POST http://localhost:5000/api/url/public/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

### Authenticated shorten

```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"longUrl":"https://example.com"}'
```

### User history

```bash
curl -X GET http://localhost:5000/api/url/user/history \
  -H "Authorization: Bearer <token>"
```

## Author

Built by Hariom.

- GitHub: `https://github.com/hariomop12`

## License

No explicit license file is present in the repository right now. If you plan to open-source this publicly, adding a `LICENSE` file would be a good next step.
