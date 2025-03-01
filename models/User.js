const db = require("../config/db");

const User = {
  create: async (username, email, hashedPassword) => {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [username, email, hashedPassword];

    try {
      const result = await db.query(query, values);
      return result.rows[0].id; // Return the newly created user's ID
    } catch (error) {
      console.error("Error creating user:", error); // Log the error
      throw new Error("Error creating user in database"); // Throw a generic error
    }
  },

  findByEmail: async (email) => {
    const query = `
      SELECT * FROM users WHERE email = $1;
    `;
    const values = [email];

    try {
      const result = await db.query(query, values);
      return result.rows[0] || null ; // Return the user object, or undefined if not found
    } catch (error) {
      console.error("Error finding user by email:", error); // Log the error
      throw new Error("Error finding user in database"); // Throw a generic error
    }
  },

  findByUsername: async (username) => {
    const query = `SELECT * FROM users WHERE username = $1;`;
    const values = [username];

    try {
      const result = await db.query(query, values);
      return result.rows[0] || null; // Return user or null if not found
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw new Error("Error finding user in database");
    }
  },
};

module.exports = User;