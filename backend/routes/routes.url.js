const express = require("express");
const {
  shortenUrl,
  redirectToUrl,
  getUserUrls,
} = require("../controllers/controller.url");
const authMiddleware = require("../middleware/middleware.auth");
const router = express.Router();

// Public routes - anyone can access
router.get("/:shortUrl", redirectToUrl);

// Anonymous shortening (no authentication required)
router.post("/public/shorten", shortenUrl);

// Protected routes - requires authentication
router.post("/shorten", authMiddleware, shortenUrl); // Auth required, will associate URLs with user
router.get("/user/history", authMiddleware, getUserUrls);

module.exports = router;
