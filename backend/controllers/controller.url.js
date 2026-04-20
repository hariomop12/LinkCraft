const Url = require("../models/modle.url");
const User = require("../models/modle.user");
const logger = require("../utils/logger");
require("dotenv").config();

// NEW: Get global user stats (for dashboard cards)
const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const [stats, user] = await Promise.all([
      Url.getUserStats(userId),
      User.findById(userId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      totalUrls: stats.totalUrls,
      totalClicks: stats.totalClicks,
      memberSince: user.created_at,
    });
  } catch (error) {
    logger.error("Error fetching user stats", { error: error.message });
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

const shortenUrl = async (req, res) => {
  const { longUrl, customCode } = req.body;
  const userId = req.user?.userId || null;
  const baseUrl = process.env.BASE_URL || `http://${req.get("host")}`;

  if (!longUrl) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    if (customCode) {
      if (!Url.validateCustomCode(customCode)) {
        return res.status(400).json({
          message:
            "Invalid custom code format. Use 3-50 characters: a-z, A-Z, 0-9, -, _",
        });
      }

      const isReserved = await Url.isReservedWord(customCode);
      if (isReserved) {
        return res.status(409).json({
          message: "This custom code is reserved and cannot be used",
        });
      }

      const exists = await Url.codeExists(customCode);
      if (exists) {
        return res.status(409).json({
          message:
            "This custom code is already taken. Please choose another one.",
        });
      }
    }

    const shortUrl = await Url.create(longUrl, userId, customCode);

    logger.info("URL shortened successfully", {
      userId: userId || "anonymous",
      shortUrl,
      isCustomCode: !!customCode,
    });

    res.status(201).json({
      shortUrl,
      fullShortUrl: `${baseUrl}/u/${shortUrl}`,
      longUrl,
      isCustomCode: !!customCode,
      message: "URL shortened successfully",
    });
  } catch (error) {
    logger.error("Error shortening URL", { error: error.message });

    if (error.message.includes("reserved") || error.message.includes("taken")) {
      return res.status(409).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error while shortening URL" });
  }
};

// Redirect to original URL
const redirectToUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findByShortUrl(shortUrl);

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Check if URL is disabled
    if (url.status === "disabled") {
      return res.status(410).json({ message: "This link has been disabled" });
    }

    await Url.incrementClickCount(url.id);
    return res.redirect(url.longurl);
  } catch (error) {
    logger.error("Error redirecting to URL", { error: error.message });
    res.status(500).json({ message: "Server error while redirecting" });
  }
};

// Get user's URL history
const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.userId;
    const baseUrl = process.env.BASE_URL || `http://${req.get("host")}`;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const urls = await Url.getUserUrls(userId);

    const formattedUrls = urls.map((url) => ({
      id: url.id,
      shortUrl: url.shorturl,
      fullShortUrl: `${baseUrl}/u/${url.shorturl}`,
      longUrl: url.longurl,
      createdAt: url.createdat,
      clickCount: url.click_count,
      lastAccessed: url.last_accessed,
      title: url.title,
      description: url.description,
      tags: url.tags,
      status: url.status,
      isCustomCode: url.is_custom_code,
    }));

    const totalClicks = formattedUrls.reduce(
      (sum, url) => sum + (url.clickCount || 0),
      0,
    );
    const oldestUrl =
      formattedUrls.length > 0
        ? new Date(
            Math.min(
              ...formattedUrls.map((url) => new Date(url.createdAt).getTime()),
            ),
          )
        : null;

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
        statistics: {
          totalUrls: formattedUrls.length,
          totalClicks: totalClicks,
          memberSince: user.created_at,
          oldestUrl: oldestUrl,
        },
      },
      urls: formattedUrls,
      count: formattedUrls.length,
    });
  } catch (error) {
    logger.error("Error getting user URLs", { error: error.message });
    res.status(500).json({ message: "Server error while fetching URLs" });
  }
};

// NEW: Search URLs with filters
const searchUrls = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const {
      q = "",
      tags = "",
      status = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const baseUrl = process.env.BASE_URL || `http://${req.get("host")}`;

    const result = await Url.searchUrls(
      userId,
      q,
      tags,
      status,
      parseInt(page),
      parseInt(limit),
    );

    const formattedUrls = result.urls.map((url) => ({
      id: url.id,
      shortUrl: url.shorturl,
      fullShortUrl: `${baseUrl}/u/${url.shorturl}`,
      longUrl: url.longurl,
      createdAt: url.createdat,
      clickCount: url.click_count,
      lastAccessed: url.last_accessed,
      title: url.title,
      description: url.description,
      tags: url.tags,
      status: url.status,
      isCustomCode: url.is_custom_code,
      updatedAt: url.updated_at,
    }));

    // Calculate total clicks from ALL user URLs, not just the current page
    const allUrls = await Url.getUserUrls(userId);
    const allTotalClicks = allUrls.reduce(
      (sum, url) => sum + (url.click_count || 0),
      0,
    );

    res.json({
      urls: formattedUrls,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      statistics: {
        totalUrls: result.total,
        totalClicks: allTotalClicks,
        memberSince: (await User.findById(userId)).created_at,
      },
    });
  } catch (error) {
    logger.error("Error searching URLs", { error: error.message });
    res.status(500).json({ message: "Server error while searching URLs" });
  }
};

// NEW: Update URL details
const updateUrl = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { longUrl, title, description, tags } = req.body;

    // Validate URL if provided
    if (longUrl) {
      try {
        new URL(longUrl);
      } catch (err) {
        return res.status(400).json({ message: "Invalid URL format" });
      }
    }

    const updated = await Url.updateUrl(id, userId, {
      longUrl,
      title,
      description,
      tags,
    });

    res.json({
      message: "URL updated successfully",
      url: updated,
    });
  } catch (error) {
    logger.error("Error updating URL", { error: error.message });

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error while updating URL" });
  }
};

// NEW: Toggle URL status
const toggleUrlStatus = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const updated = await Url.toggleStatus(id, userId);

    res.json({
      message: `URL ${updated.status === "active" ? "enabled" : "disabled"} successfully`,
      status: updated.status,
      url: updated,
    });
  } catch (error) {
    logger.error("Error toggling URL status", { error: error.message });

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error while updating URL status" });
  }
};

// NEW: Delete URL
const deleteUrl = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = await Url.deleteUrl(id, userId);

    res.json({
      message: "URL deleted successfully",
      id: result.id,
    });
  } catch (error) {
    logger.error("Error deleting URL", { error: error.message });

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error while deleting URL" });
  }
};

// NEW: Get URL stats
const getUrlStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const stats = await Url.getUrlStats(id, userId);

    res.json(stats);
  } catch (error) {
    logger.error("Error getting URL stats", { error: error.message });

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

module.exports = {
  shortenUrl,
  redirectToUrl,
  getUserUrls,
  searchUrls,
  getUserStats,
  updateUrl,
  toggleUrlStatus,
  deleteUrl,
  getUrlStats,
};
