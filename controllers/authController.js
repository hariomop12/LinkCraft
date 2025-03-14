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
      message: "Please enter all fields",
      Temp: "All fields required",
    });
  }
  // check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    logger.warn("User already exists", { email });
    return res.status(409).json({
      message: "User with this email already exists",
    });
  }
  logger.info("Signup request received", { username, email });

  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug("Password hashed successfully", { email });

  try {
    const userId = await User.create(username, email, hashedPassword);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info("User registered successfully", { email, userId });
    res.status(201).json({ token, chut: "Chuttamale💕" });
  } catch (error) {
    logger.error("Signup error", { email, error: error.message });
    res
      .status(400)
      .json({ message: error.message, Temp: "Error in Creating User💚" });
  }
};

// 📌 Login API
const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let user = await User.findByEmail(identifier);

    if (!user) {
      user = await User.findByUsername(identifier);
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info("User logged in successfully", { userId: user.id, identifier });

    res.json({ token });
  } catch (error) {
    logger.error("Login error", { error: error.message, identifier });
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { signup, login };
