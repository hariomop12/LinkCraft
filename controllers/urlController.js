const Url = require("../models/Url");
const logger = require("../utils/logger");

const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const userId = req.user?.userId; // Corrected to match JWT structure

  logger.debug(`Extracted userId: ${userId}`);

  if (!longUrl) {
    logger.warn("Missing longUrl in request body");
    return res.status(400).json({ message: "Missing longUrl in request body" });
  }

  if (!userId) {
    logger.warn("User ID is missing from request");
    return res.status(401).json({ message: "Unauthorized: User ID is required" });
  }

  try {
    const shortUrl = await Url.create(longUrl, userId);
    res.json({ shortUrl });
  } catch (err) {
    logger.error(`Error shortening URL: ${err.message}`, { error: err });
    res.status(500).json({ message: "Internal server error. Please try again." });
  }
};

const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findByShortUrl(shortUrl);

    if (!url) {
      logger.warn(`Short URL not found: ${shortUrl}`);
      return res.status(404).json({ message: "URL not found." });
    }

    res.redirect(url.long_url);

  } catch (err) {
    logger.error(`Error finding short URL: ${err.message}`, { error: err });
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
};
module.exports = { shortenUrl, redirectUrl };
