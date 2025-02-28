const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup data:", req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);
  
  try {
    const userId = await User.create(username, email, hashedPassword);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, chut: "Chuttamale💕" });
  } catch (error) {
    console.error("Signup error:", error); // Log the error
    res
      .status(400)
      .json({ message: error.message, Temp: "Error in Creating User💚" });
  }
};

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
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message, Temp: "Login failed" });
  }
};

module.exports = { signup, login };
