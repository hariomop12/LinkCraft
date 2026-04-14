-- migrate:up
-- Drop existing tables
DROP TABLE IF EXISTS user_url_history;
DROP TABLE IF EXISTS urls;

-- Recreate tables with consistent column casing (all lowercase to avoid case issues)
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    shorturl VARCHAR(10) NOT NULL UNIQUE,
    longurl VARCHAR(2000) NOT NULL,
    userid INTEGER REFERENCES users(id),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE user_url_history (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES users(id),
    urlid INTEGER NOT NULL REFERENCES urls(id),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userid, urlid)
);

-- migrate:down
-- Nothing to do for down migration since we're fixing existing schema