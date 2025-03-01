const express = require('express');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/shorten', authMiddleware, shortenUrl);
router.get('/:shortUrl', redirectUrl);

module.exports = router;