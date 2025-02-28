const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
require("dotenv").config();

// 📌 Signup API
const signup = async (req, res) => {
  const { username, email, password } = req.body;
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
    logger.error("Signup error", { email, error: error.message });    res
      .status(400)
      .json({ message: error.message, Temp: "Error in Creating User💚" });
  }
};


// 📌 Login API
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info("User logged in successfully", { email, userId: user.id });
    res.json({ token });
  } catch (error) {
    logger.error("Login error", { email, error: error.message });
    res.status(500).json({ message: error.message, Temp: "Login failed" });
  }
};

module.exports = { signup, login };
