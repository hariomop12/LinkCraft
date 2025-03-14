const db = require("../config/db");
const shortid = require("shortid");

class Url {
  static async create(longUrl, userId = null) {
    const shortUrl = shortid.generate();
    
    try {
      // Use lowercase column names without quotes
      const query = userId 
        ? `INSERT INTO urls(shorturl, longurl, userid, createdat) 
           VALUES($1, $2, $3, NOW()) 
           RETURNING shorturl` 
        : `INSERT INTO urls(shorturl, longurl, createdat) 
           VALUES($1, $2, NOW()) 
           RETURNING shorturl`;
        
      const values = userId ? [shortUrl, longUrl, userId] : [shortUrl, longUrl];
      
      const result = await db.query(query, values);
      return result.rows[0].shorturl; // lowercase column name
    } catch (error) {
      console.error("Error creating shortened URL:", error);
      throw new Error("Failed to create shortened URL");
    }
  }
  
  static async findByShortUrl(shortUrl) {
    try {
      const query = `SELECT * FROM urls WHERE shorturl = $1`; // lowercase column name
      const result = await db.query(query, [shortUrl]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding URL:", error);
      throw new Error("Failed to retrieve URL");
    }
  }
  
  static async incrementClickCount(id) {
    try {
      const query = `
        UPDATE urls 
        SET click_count = click_count + 1, last_accessed = NOW() 
        WHERE id = $1
      `;
      await db.query(query, [id]);
    } catch (error) {
      console.error("Error incrementing click count:", error);
    }
  }
  
  static async getUserUrls(userId) {
    try {
      const query = `
        SELECT id, shorturl, longurl, createdat, click_count, last_accessed, title, description
        FROM urls 
        WHERE userid = $1 
        ORDER BY createdat DESC
      `; // lowercase column names
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error getting user URLs:", error);
      throw new Error("Failed to retrieve user's URLs");
    }
  }
}

module.exports = Url;