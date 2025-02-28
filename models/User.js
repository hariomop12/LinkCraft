const db = require("../config/db");

class User {
  static async create(username, email, password) {
    const [result] = await db.query(
      `INSERT INTO users(username, email, password) VALUES(?, ?, ?)`,
      [username, email, password]
    );
  }
  static async findByEmail(email) {
    const [rows] = await db.query(
      `
        SELECT * FROM users WHERE email = ?
        `,
      [email]
    );
    return rows[0];
  }
}

module.exports = User;
