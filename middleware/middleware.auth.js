const jwt = require("jsonwebtoken");
const logger = require("../utils/logger"); // Ensure logger is properly set up

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  // Log the raw Authorization header
  logger.debug(`Authorization Header: ${authHeader}`);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Missing or malformed Authorization header");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request
    logger.info(`User authenticated: ${JSON.stringify(req.user)}`);
    next();
  } catch (err) {
    logger.error(`JWT verification failed: ${err.message}`);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
