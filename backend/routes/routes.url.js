const express = require("express");
const {
  shortenUrl,
  redirectToUrl,
  getUserUrls,
  searchUrls,
  getUserStats,
  updateUrl,
  toggleUrlStatus,
  deleteUrl,
  getUrlStats,
} = require("../controllers/controller.url");
const authMiddleware = require("../middleware/middleware.auth");
const router = express.Router();

// IMPORTANT: Order matters! More specific routes must come BEFORE generic :id routes

// Public routes (must be before /:id routes)
router.post("/public/shorten", shortenUrl);

  // Protected dashboard/specific routes (more specific patterns)
router.get("/user/history", authMiddleware, getUserUrls);
router.get("/dashboard/search", authMiddleware, searchUrls);
router.get("/stats", authMiddleware, getUserStats);
router.get("/:id/stats", authMiddleware, getUrlStats);
router.put("/:id", authMiddleware, updateUrl);
router.patch("/:id/toggle", authMiddleware, toggleUrlStatus);
router.delete("/:id", authMiddleware, deleteUrl);

// Protected auth-required shortening
router.post("/shorten", authMiddleware, shortenUrl);

// Generic redirect route (MUST be last for public short URLs)
router.get("/:shortUrl", redirectToUrl);

module.exports = router;
