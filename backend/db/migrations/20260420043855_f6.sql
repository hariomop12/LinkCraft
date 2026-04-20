-- migrate:up
ALTER TABLE urls ADD COLUMN IF NOT EXISTS is_custom_code BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS reserved_words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL UNIQUE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO reserved_words (word, reason) VALUES
    ('admin', 'System reserved'),
    ('api', 'System reserved'),
    ('user', 'System reserved'),
    ('health', 'System reserved'),
    ('auth', 'System reserved'),
    ('login', 'System reserved'),
    ('logout', 'System reserved'),
    ('register', 'System reserved'),
    ('dashboard', 'System reserved'),
    ('settings', 'System reserved'),
    ('profile', 'System reserved'),
    ('help', 'System reserved'),
    ('about', 'System reserved'),
    ('contact', 'System reserved'),
    ('privacy', 'System reserved'),
    ('terms', 'System reserved');

-- migrate:down
ALTER TABLE urls DROP COLUMN IF EXISTS is_custom_code;
DROP TABLE IF EXISTS reserved_words;