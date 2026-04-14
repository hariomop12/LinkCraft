const express = require('express');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per 15 minutes per IP
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });


router.post('/shorten', authMiddleware, limiter, shortenUrl);
router.get('/:shortUrl', redirectUrl);

module.exports = router;