const db = require("../config/db");
const shortid = require("shortid");

class Url {
  // Check if a custom code is reserved
  static async isReservedWord(code) {
    try {
      const query = `SELECT id FROM reserved_words WHERE LOWER(word) = LOWER($1)`;
      const result = await db.query(query, [code]);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error checking reserved word:", error);
      throw new Error("Failed to check reserved words");
    }
  }

  // Check if a custom code already exists
  static async codeExists(code) {
    try {
      const query = `SELECT id FROM urls WHERE LOWER(shorturl) = LOWER($1)`;
      const result = await db.query(query, [code]);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error checking code existence:", error);
      throw new Error("Failed to check code availability");
    }
  }

  // Validate custom short code format
  static validateCustomCode(code) {
    const pattern = /^[a-zA-Z0-9_-]{3,50}$/;
    return pattern.test(code);
  }

  // ✅ GET GLOBAL STATS (IMPORTANT)
  static async getUserStats(userId) {
    try {
      const query = `
      SELECT 
        COUNT(*) AS total_urls,
        COALESCE(SUM(click_count), 0) AS total_clicks,
        MIN(createdat) AS member_since
      FROM urls
      WHERE userid = $1
    `;

      const result = await db.query(query, [userId]);
      const row = result.rows[0];

      return {
        totalUrls: parseInt(row.total_urls),
        totalClicks: parseInt(row.total_clicks),
        memberSince: row.member_since,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw new Error("Failed to fetch stats");
    }
  }
  
  // Create shortened URL with optional custom code
  static async create(longUrl, userId = null, customCode = null) {
    let shortUrl = customCode;

    try {
      if (customCode) {
        if (!this.validateCustomCode(customCode)) {
          throw new Error(
            "Invalid custom code format. Use 3-50 characters: a-z, A-Z, 0-9, -, _",
          );
        }

        if (await this.isReservedWord(customCode)) {
          throw new Error("This custom code is reserved and cannot be used");
        }

        if (await this.codeExists(customCode)) {
          throw new Error("This custom code is already taken");
        }
      } else {
        shortUrl = shortid.generate();
      }

      const query = userId
        ? `INSERT INTO urls(shorturl, longurl, userid, createdat, status, updated_at, is_custom_code) 
           VALUES($1, $2, $3, NOW(), 'active', NOW(), $4) 
           RETURNING shorturl`
        : `INSERT INTO urls(shorturl, longurl, createdat, status, updated_at, is_custom_code) 
           VALUES($1, $2, NOW(), 'active', NOW(), $3) 
           RETURNING shorturl`;

      const values = userId
        ? [shortUrl, longUrl, userId, !!customCode]
        : [shortUrl, longUrl, !!customCode];

      const result = await db.query(query, values);
      return result.rows[0].shorturl;
    } catch (error) {
      console.error("Error creating shortened URL:", error);
      throw error;
    }
  }

  static async findByShortUrl(shortUrl) {
    try {
      const query = `SELECT * FROM urls WHERE shorturl = $1`;
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
        SELECT id, shorturl, longurl, createdat, click_count, last_accessed, title, description, tags, status, updated_at, is_custom_code
        FROM urls 
        WHERE userid = $1 
        ORDER BY createdat DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error getting user URLs:", error);
      throw new Error("Failed to retrieve user's URLs");
    }
  }

  // NEW: Search URLs with filters and pagination
  static async searchUrls(
    userId,
    searchTerm = "",
    tags = "",
    status = "all",
    page = 1,
    limit = 10,
  ) {
    try {
      let query = `
        SELECT id, shorturl, longurl, createdat, click_count, last_accessed, title, description, tags, status, updated_at, is_custom_code
        FROM urls 
        WHERE userid = $1
      `;

      const params = [userId];
      let paramIndex = 2;

      // Add search filter (search in shorturl, longurl, title, description)
      if (searchTerm) {
        query += ` AND (
          shorturl ILIKE $${paramIndex} 
          OR longurl ILIKE $${paramIndex} 
          OR title ILIKE $${paramIndex}
          OR description ILIKE $${paramIndex}
        )`;
        params.push(`%${searchTerm}%`);
        paramIndex++;
      }

      // Add tags filter (comma-separated)
      if (tags && tags !== "") {
        const tagArray = tags.split(",").map((t) => t.trim());
        query += ` AND tags && $${paramIndex}`;
        params.push(tagArray);
        paramIndex++;
      }

      // Add status filter
      if (status && status !== "all") {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      // Count total results
      const countQuery = query.replace(
        /SELECT id, shorturl, longurl, createdat, click_count, last_accessed, title, description, tags, status, updated_at, is_custom_code/,
        "SELECT COUNT(*) as total",
      );
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);

      // Add sorting and pagination
      query += ` ORDER BY createdat DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, (page - 1) * limit);

      const result = await db.query(query, params);

      return {
        urls: result.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error searching URLs:", error);
      throw new Error("Failed to search URLs");
    }
  }

  // NEW: Update URL details
  static async updateUrl(id, userId, updates) {
    try {
      const { longUrl, title, description, tags } = updates;

      // Only allow owner to update
      const checkQuery = `SELECT userid FROM urls WHERE id = $1`;
      const checkResult = await db.query(checkQuery, [id]);

      if (!checkResult.rows[0] || checkResult.rows[0].userid !== userId) {
        throw new Error("Unauthorized: You can only edit your own URLs");
      }

      const query = `
        UPDATE urls 
        SET 
          longurl = COALESCE($1, longurl),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          tags = COALESCE($4, tags),
          updated_at = NOW()
        WHERE id = $5 AND userid = $6
        RETURNING *
      `;

      const result = await db.query(query, [
        longUrl,
        title,
        description,
        tags,
        id,
        userId,
      ]);

      if (result.rows.length === 0) {
        throw new Error("URL not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating URL:", error);
      throw error;
    }
  }

  // NEW: Toggle URL status (active/disabled)
  static async toggleStatus(id, userId) {
    try {
      const checkQuery = `SELECT userid, status FROM urls WHERE id = $1`;
      const checkResult = await db.query(checkQuery, [id]);

      if (!checkResult.rows[0] || checkResult.rows[0].userid !== userId) {
        throw new Error("Unauthorized: You can only modify your own URLs");
      }

      const currentStatus = checkResult.rows[0].status;
      const newStatus = currentStatus === "active" ? "disabled" : "active";

      const query = `
        UPDATE urls 
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND userid = $3
        RETURNING *
      `;

      const result = await db.query(query, [newStatus, id, userId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error toggling status:", error);
      throw error;
    }
  }

  // NEW: Delete URL (hard delete)
  static async deleteUrl(id, userId) {
    try {
      const checkQuery = `SELECT userid FROM urls WHERE id = $1`;
      const checkResult = await db.query(checkQuery, [id]);

      if (!checkResult.rows[0] || checkResult.rows[0].userid !== userId) {
        throw new Error("Unauthorized: You can only delete your own URLs");
      }

      const query = `DELETE FROM urls WHERE id = $1 AND userid = $2 RETURNING id`;
      const result = await db.query(query, [id, userId]);

      if (result.rows.length === 0) {
        throw new Error("URL not found");
      }

      return { message: "URL deleted successfully", id };
    } catch (error) {
      console.error("Error deleting URL:", error);
      throw error;
    }
  }

  // NEW: Get detailed stats for a URL
  static async getUrlStats(id, userId) {
    try {
      const query = `
        SELECT 
          id, 
          shorturl, 
          longurl, 
          createdat, 
          click_count, 
          last_accessed, 
          title, 
          description, 
          tags, 
          status, 
          updated_at,
          is_custom_code,
          userid
        FROM urls 
        WHERE id = $1 AND userid = $2
      `;

      const result = await db.query(query, [id, userId]);

      if (result.rows.length === 0) {
        throw new Error("URL not found or unauthorized");
      }

      const url = result.rows[0];

      return {
        id: url.id,
        shortUrl: url.shorturl,
        longUrl: url.longurl,
        title: url.title,
        description: url.description,
        tags: url.tags,
        status: url.status,
        isCustomCode: url.is_custom_code,
        stats: {
          clicks: url.click_count,
          lastAccessed: url.last_accessed,
          createdAt: url.createdat,
          updatedAt: url.updated_at,
          daysOld: Math.floor(
            (Date.now() - new Date(url.createdat)) / (1000 * 60 * 60 * 24),
          ),
        },
      };
    } catch (error) {
      console.error("Error getting URL stats:", error);
      throw error;
    }
  }
}

module.exports = Url;
