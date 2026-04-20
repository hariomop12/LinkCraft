const express = require("express");
const {
  shortenUrl,
  redirectToUrl,
  getUserUrls,
} = require("../controllers/controller.url");
const authMiddleware = require("../middleware/middleware.auth");
const router = express.Router();

// Public routes
router.get("/:shortUrl", redirectToUrl);

// Anonymous shortening (can include customCode)
router.post("/public/shorten", shortenUrl);

// Protected routes
router.post("/shorten", authMiddleware, shortenUrl);
router.get("/user/history", authMiddleware, getUserUrls);

module.exports = router;
