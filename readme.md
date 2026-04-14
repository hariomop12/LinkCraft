# LinkCraft Backend

LinkCraft is a Node.js + Express backend for a URL shortening service with user authentication, user URL history, and public anonymous shortening.

## Project Overview

This backend provides:

- User signup and login using JWT authentication
- Authenticated URL shortening with per-user URL history
- Anonymous public URL shortening
- Redirect support for shortened URLs
- PostgreSQL storage for users and URLs
- Basic security middleware, request logging, and rate limiting

## Key Features

- `POST /api/auth/signup`
  - Creates a new user account
- `POST /api/auth/login`
  - Authenticates a user and returns a JWT token
- `POST /api/url/public/shorten`
  - Shortens a URL without requiring authentication
- `POST /api/url/shorten`
  - Shortens a URL for a logged-in user and saves the record in the database
- `GET /api/url/user/history`
  - Returns the authenticated user's saved URLs and statistics
- `GET /u/:shortUrl`
  - Redirects a short URL to the original long URL
- `GET /health`
  - Returns a simple health check response

## Repository Structure

- `server.js` - Application entry point and main Express setup
- `routes/routes.auth.js` - Auth-related routes
- `routes/routes.url.js` - URL-related routes
- `controllers/controller.auth.js` - Signup/login business logic
- `controllers/controller.url.js` - URL shortening, redirect, and history logic
- `middleware/middleware.auth.js` - JWT authentication middleware
- `middleware/middleware.validation.js` - Input validation with `express-validator`
- `config/db.js` - PostgreSQL database connection configuration
- `models/modle.user.js` - User database access methods
- `models/modle.url.js` - URL database access methods
- `utils/logger.js` - Logging helper (used by request logging and error reporting)
- `db/migrations/` - SQL migration scripts for table creation and schema updates

## Requirements

- Node.js `>= 18`
- PostgreSQL database
- Recommended: `npm` package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/linkcraft-backend.git
cd LinkCraft
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and configure environment variables.

4. Start the server in development mode:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

## Environment Variables

Create a `.env` file with the following values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret_here
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
```

Notes:

- `FRONTEND_URL` is used for CORS configuration.
- `BASE_URL` is used to build shortened URL responses.
- `JWT_SECRET` is required for auth token signing and verification.

## Database Setup

The project uses PostgreSQL and expects the following tables:

- `users`
  - `id` SERIAL PRIMARY KEY
  - `username` VARCHAR(50)
  - `email` VARCHAR(100) UNIQUE
  - `password` VARCHAR(255)
  - `created_at` TIMESTAMP

- `urls`
  - `id` SERIAL PRIMARY KEY
  - `shorturl` VARCHAR(10) UNIQUE
  - `longurl` VARCHAR(2000)
  - `userid` INTEGER REFERENCES users(id)
  - `createdat` TIMESTAMP
  - `click_count` INTEGER
  - `last_accessed` TIMESTAMP
  - `title` VARCHAR(255)
  - `description` TEXT

- `user_url_history`
  - `id` SERIAL PRIMARY KEY
  - `userid` INTEGER REFERENCES users(id)
  - `urlid` INTEGER REFERENCES urls(id)
  - `createdat` TIMESTAMP

### Migrations

Migration files are stored in `db/migrations/`. The latest schema updates are available there and include:

- `20250313210241_f1.sql`
- `20250313213002_f2.sql`
- `20250314062703_f3.sql`
- `20250314070241_f4.sql`
- `20250314071953_f5.sql`

## API Reference

### Public Endpoints

- `GET /`
  - Returns a welcome message.

- `GET /health`
  - Returns API health status and environment.

- `POST /api/url/public/shorten`
  - Request body:
    - `longUrl`: string
  - Response:
    - `shortUrl`
    - `fullShortUrl`
    - `longUrl`
    - `message`

- `GET /u/:shortUrl`
  - Redirects to the original URL stored for the short code.

### Authentication Endpoints

- `POST /api/auth/signup`
  - Request body:
    - `username`
    - `email`
    - `password`
  - Validation rules:
    - username: 3–30 alphanumeric characters
    - email: valid email
    - password: minimum 8 characters with uppercase, lowercase, number, and special symbol

- `POST /api/auth/login`
  - Request body:
    - `email`
    - `password`
  - Returns a JWT token on success.

### Protected Endpoints

These require the `Authorization: Bearer <token>` header.

- `POST /api/url/shorten`
  - Request body:
    - `longUrl`
  - Returns the shortened URL for the authenticated user.

- `GET /api/url/user/history`
  - Returns authenticated user’s saved URLs, click counts, and metadata.

## Example Requests

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"Passw0rd!"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Passw0rd!"}'
```

### Shorten URL (authenticated)

```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"longUrl":"https://example.com"}'
```

### Get User History

```bash
curl -X GET http://localhost:5000/api/url/user/history \
  -H "Authorization: Bearer <token>"
```

## Notes

- No automated tests are currently configured in `package.json`.
- The project uses `express-rate-limit` to limit requests and prevent abuse.
- URL generation uses `shortid` for short code creation.
- Logging is enabled with `morgan` and a custom logger helper.

## Scripts

- `npm install` — install dependencies
- `npm start` — run the server
- `npm run dev` — run with `nodemon`
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Improvements

Possible future enhancements:

- Add automated tests
- Add database migration tooling like `knex` or `sequelize`
- Add endpoint documentation with Swagger/OpenAPI
- Add stronger URL analytics and user dashboard endpoints
- Add frontend integration examples
