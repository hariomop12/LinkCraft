-- migrate:up
-- Create the users table if it doesn't exist (should be created first)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or update urls table 
CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    "shortUrl" VARCHAR(10) NOT NULL UNIQUE,
    "longUrl" VARCHAR(2000) NOT NULL,
    "userId" INTEGER REFERENCES users(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    title VARCHAR(255),
    description TEXT
);

-- Create user_url_history table
CREATE TABLE IF NOT EXISTS user_url_history (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    "urlId" INTEGER NOT NULL REFERENCES urls(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "urlId")
);

-- migrate:down
DROP TABLE IF EXISTS user_url_history;
DROP TABLE IF EXISTS urls;