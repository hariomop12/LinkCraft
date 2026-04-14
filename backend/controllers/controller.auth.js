const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/modle.user");
const logger = require("../utils/logger");
require("dotenv").config();

// 📌 Signup API
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  logger.info("📩 Signup request received", { username, email });

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      logger.warn("⚠️ Signup attempt with existing email", { email });
      return res.status(400).json({ message: "❌ Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    logger.debug("🔐 Password hashed successfully", { email });

    const userId = await User.create(username, email, hashedPassword);
    logger.info("✅ User registered successfully", { email, userId });
    res.status(201).json({ message: "🎉 User created successfully" });
  } catch (error) {
    logger.error("❗ Signup error", { email, error: error.message });
    res.status(500).json({ message: "⚠️ Error creating user account" });
  }
};

// 📌 Login API
const login = async (req, res) => {
  const { email, password } = req.body;
  logger.info("🔑 Login attempt", { email });

  try {
    const user = await User.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn("❌ Failed login attempt", { email });
      return res.status(401).json({ message: "❌ Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info("✅ User logged in successfully", { email, userId: user.id });
    res.json({ message: "🎉 Login successful", token });
  } catch (error) {
    logger.error("❗ Login error", { email, error: error.message });
    res.status(500).json({ message: "⚠️ Login failed due to server error" });
  }
};

module.exports = { signup, login };
