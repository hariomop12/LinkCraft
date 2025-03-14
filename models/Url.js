const db = require("../config/db");
const shortid = require("shortid");
const logger = require("../utils/logger");

class Url {
  
  static async create(longUrl, userId) {
    try {
      // Check if URL already exists
      const existing = await db.query(
        "SELECT short_url FROM urls WHERE long_url = $1 AND user_id = $2",
        [longUrl, userId]
      );

      if (existing.rows.length > 0) {
        const shortUrl = existing.rows[0].short_url;
        logger.info(`Returning existing short URL: ${shortUrl} for user ${userId}`);
        return { shortUrl, fullUrl: `http://localhost:3000/${shortUrl}` }; // Ensure full URL
      }

      // Generate new short URL
      let shortUrl;
      let isUnique = false;

      while (!isUnique) {
        shortUrl = shortid.generate();
        const check = await db.query("SELECT short_url FROM urls WHERE short_url = $1", [shortUrl]);
        if (check.rows.length === 0) isUnique = true;
      }

      // Insert new record
      const result = await db.query(
        "INSERT INTO urls (short_url, long_url, user_id) VALUES ($1, $2, $3) RETURNING short_url",
        [shortUrl, longUrl, userId]
      );

      logger.info(`New Short URL created: ${shortUrl} for user ${userId}`);
      return { shortUrl: result.rows[0].short_url, fullUrl: `http://localhost:3000/${result.rows[0].short_url}` };
      
    } catch (err) {
      logger.error(`Error creating short URL: ${err.message}`, { error: err });
      throw new Error("Database error: Unable to create short URL");
    }
  }

  // ⬇️ This method was **outside** the class. I moved it **inside**
  static async findByShortUrl(shortUrl) {
    try {
      const { rows } = await db.query("SELECT * FROM urls WHERE short_url = $1", [
        shortUrl,
      ]);

      if (rows.length === 0) {
        logger.warn(`Short URL not found: ${shortUrl}`);
        return null;
      }

      return rows[0];
    } catch (err) {
      logger.error(`Error fetching short URL: ${err.message}`, { error: err });
      throw new Error("Database error: Unable to fetch URL");
    }
  }
}

// Exporting the class properly
module.exports = Url;
