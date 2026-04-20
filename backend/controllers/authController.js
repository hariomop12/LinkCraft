const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
require("dotenv").config();

// 📌 Signup API
const signup = async (req, res) => {
  // get user data from request body
  const { username, email, password } = req.body;
  // check if all fields are entered
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "❌ Please enter all fields",
    });
  }
  // check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    logger.warn("⚠️ User already exists", { email });
    return res.status(409).json({
      message: "❌ User with this email already exists",
    });
  }
  logger.info("📩 Signup request received", { username, email });

  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug("🔐 Password hashed successfully", { email });

  try {
    const userId = await User.create(username, email, hashedPassword);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info("✅ User registered successfully", { email, userId });
    res.status(201).json({ token, message: "🎉 User created successfully" }); // Added message for UX; removed "Temp" debug field
  } catch (error) {
    logger.error("❗ Signup error", { email, error: error.message });
    res.status(400).json({ message: "⚠️ Error creating user account" }); // Improved message; removed "Temp" debug field
  }
};

// 📌 Login API
const login = async (req, res) => {
  const { email, password } = req.body; // Changed from { identifier, password } to { email, password } for consistency with frontend/validation

  try {
    const user = await User.findByEmail(email); // Changed to only check email (removed username fallback) to match validation/frontend

    if (!user || !user.password) {
      return res.status(401).json({ message: "❌ Invalid email or password" }); // Improved message for UX
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid email or password" }); // Improved message for UX
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info("✅ User logged in successfully", { userId: user.id, email }); // Updated logging to use email

    res.json({ token, message: "🎉 Login successful" }); // Added message for UX
  } catch (error) {
    logger.error("❗ Login error", { error: error.message, email }); // Updated logging to use email
    res.status(500).json({ message: "⚠️ Login failed due to server error" }); // Improved message for UX
  }
};

module.exports = { signup, login };
