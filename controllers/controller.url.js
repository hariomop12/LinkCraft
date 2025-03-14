const Url = require("../models/modle.url");
const User = require("../models/modle.user");  // Add this line
const logger = require("../utils/logger");
require("dotenv").config();

const shortenUrl = async (req, res) => {
    const { longUrl } = req.body;
    // Extract user ID from authentication token if available
    const userId = req.user?.userId || null;
  
    // Get base URL from environment variable or use default
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
  
      // Pass the user ID to the URL creation method
      const shortUrl = await Url.create(longUrl, userId);
  
      logger.info("URL shortened successfully", {
        userId: userId || "anonymous",
        shortUrl,
      });
  
      // Return both the short code and full URL
      res.status(201).json({
        shortUrl,
        fullShortUrl: `${baseUrl}/u/${shortUrl}`,
        longUrl,
        message: "URL shortened successfully",
      });
    } catch (error) {
      logger.error("Error shortening URL", { error: error.message });
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

    // Update click count and last accessed time
    await Url.incrementClickCount(url.id);

    // Redirect to original URL (note: using lowercase column name)
    return res.redirect(url.longurl);
  } catch (error) {
    logger.error("Error redirecting to URL", { error: error.message });
    res.status(500).json({ message: "Server error while redirecting" });
  }
};

// Get user's URL history - for authenticated users only
// Get user's URL history - for authenticated users only
const getUserUrls = async (req, res) => {
    try {
      const userId = req.user.userId;
      const baseUrl = process.env.BASE_URL || `http://${req.get("host")}`;
  
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
  
      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Get user's URLs
      const urls = await Url.getUserUrls(userId);
  
      // Map the results to have consistent camelCase in the API response
      // Also add fullShortUrl for each URL
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
      }));
  
      // Calculate total metrics
      const totalClicks = formattedUrls.reduce((sum, url) => sum + (url.clickCount || 0), 0);
      const oldestUrl = formattedUrls.length > 0 ? 
        new Date(Math.min(...formattedUrls.map(url => new Date(url.createdAt).getTime()))) : null;
  
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
            oldestUrl: oldestUrl
          }
        },
        urls: formattedUrls,
        count: formattedUrls.length
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
