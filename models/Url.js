const db = require("../config/db");
const shortid = require("shortid");

class Url {
  static async create(longUrl, userId) {
    const shortUrl = shortid.generate();
    const [result] = await db.query(
      `INSERT INTO urls(shortUrl, longUrl, userId) VALUES(?, ?, ?)`,
      [shortUrl, longUrl, userId]
    );
    return shortUrl;
  }
  static async findByShortUrl(shortUrl) {
    const [rows] = await db.query(`SELECT * FROM urls WHERE shortUrl = ?`, [
      shortUrl,
    ]);
    return rows[0];
  }
}

module.exports = Url;
