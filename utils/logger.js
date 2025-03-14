const winston = require("winston");
const path = require("path");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message} ${
      meta ? JSON.stringify(meta) : ""
    }`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: "info", // Log everything from 'info' and above
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs/combined.log"),
    }),
  ],
});

// Add console transport only in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

module.exports = logger;
