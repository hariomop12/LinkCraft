const Url = require("../models/modle.url");
const User = require("../models/modle.user");
const logger = require("../utils/logger");
require("dotenv").config();

const shortenUrl = async (req, res) => {
  const { longUrl, customCode } = req.body;
  const userId = req.user?.userId || null;
  const baseUrl = process.env.BASE_URL || `http://${req.get("host")}`;

  if (!longUrl) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    // Validate URL format
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // If custom code is provided, validate and check availability
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

    // Create shortened URL
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

module.exports = {
  shortenUrl,
  redirectToUrl,
  getUserUrls,
};
