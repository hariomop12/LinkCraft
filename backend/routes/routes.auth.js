const express = require("express");
const { signup, login } = require("../controllers/controller.auth");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/middleware.validation");

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

module.exports = router;
