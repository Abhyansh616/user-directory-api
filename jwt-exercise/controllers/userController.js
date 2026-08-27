const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const userView = require("../views/userView");

const getLoginPage = (req, res) => {
  res.render("login");
};

const home = (req, res) => {
  userView.homeResponse(res);
};

const getUsers = (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user
  });
};

const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      assignedGrade,
      studentId
    } = req.body;

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
      password: hashedPassword,
      role: role || "student",
      assignedGrade,
      studentId
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        assignedGrade: user.assignedGrade,
        studentId: user.studentId
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
      message: error.message
    });
  }
};

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

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        assignedGrade: user.assignedGrade,
        studentId: user.studentId
      },
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
  registerUser,
  loginUser
};