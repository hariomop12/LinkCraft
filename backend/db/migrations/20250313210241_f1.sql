
-- Update existing urls table or create if not exists
CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    shortUrl VARCHAR(10) NOT NULL UNIQUE,
    longUrl VARCHAR(2000) NOT NULL,
    userId INTEGER REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    title VARCHAR(255),
    description TEXT
);

-- Create a table for tracking URL history per user
CREATE TABLE user_url_history (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users(id),
    urlId INTEGER NOT NULL REFERENCES urls(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, urlId)
);

--