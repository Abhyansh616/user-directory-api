const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const userView = require("../views/userView");

// Login page
const getLoginPage = (req, res) => {
  res.render("login");
};

// Home
const home = (req, res) => {
  userView.homeResponse(res);
};

// Get authenticated user
const getUsers = (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user
  });
};

// Create user
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "User creation failed",
      message: error.message
    });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
      message: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    const payload = {
      id: user._id,
      username: user.username
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
      message: error.message
    });
  }
};

module.exports = {
  getLoginPage,
  home,
  getUsers,
  createUser,
  loginUser,
  registerUser
};