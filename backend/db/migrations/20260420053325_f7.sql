-- migrate:up
-- Add dashboard features columns to urls table
ALTER TABLE urls
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_urls_userid ON urls(userid);
CREATE INDEX IF NOT EXISTS idx_urls_status ON urls(status);

-- migrate:down
ALTER TABLE urls
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS updated_at;
DROP INDEX IF EXISTS idx_urls_userid;
DROP INDEX IF EXISTS idx_urls_status;