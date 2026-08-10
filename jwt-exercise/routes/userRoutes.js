const express = require("express");
const router = express.Router();

const {
  getLoginPage,
  home,
  getUsers,
  createUser,
  loginUser
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authenticateToken");
const validateUser = require("../middleware/validateUser");
const loginRateLimiter = require("../middleware/loginRateLimiter");

// GET /login -> Renders the login page using EJS
router.get("/login", getLoginPage);

router.get("/", home);

router.get(
  "/users",
  authenticateToken,
  getUsers
);

router.post(
  "/users",
  validateUser,
  createUser
);

// POST /login -> Handles the login form submission
router.post(
  "/login",
  loginRateLimiter,
  loginUser
);

module.exports = router;