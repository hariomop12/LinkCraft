const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");
const authRoutes = require("./routes/routes.auth");
const urlRoutes = require("./routes/routes.url");
require("dotenv").config();
// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Rate limiting to protect against brute force/DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "1mb" })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Log all requests using Morgan and Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Set security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the LinkCraft API" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// For direct short URL access
app.get("/u/:shortUrl", (req, res) => {
  res.redirect(`/api/url/${req.params.shortUrl}`);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(`Error: ${err.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    statusCode,
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    status: "error",
    message:
      NODE_ENV === "production" && statusCode === 500
        ? "Internal server error"
        : err.message,
  });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    logger.info(`Health check available at: http://localhost:${PORT}/health`);
  });
}

// Export app for testing
module.exports = app;
