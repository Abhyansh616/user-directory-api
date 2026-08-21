const express = require("express");

const router = express.Router();

const {
  getLoginPage,
  home,
  getUsers,
  registerUser,
  loginUser
} = require("../controllers/userController");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const authenticateToken = require("../middleware/authenticateToken");

// Home
router.get("/login", getLoginPage);
router.get("/", home);

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected users
router.get(
  "/users",
  authenticateToken,
  getUsers
);

// Student CRUD
router.post(
  "/students",
  authenticateToken,
  createStudent
);

router.get(
  "/students",
  authenticateToken,
  getStudents
);

router.get(
  "/students/:id",
  authenticateToken,
  getStudentById
);

router.put(
  "/students/:id",
  authenticateToken,
  updateStudent
);

router.delete(
  "/students/:id",
  authenticateToken,
  deleteStudent
);

module.exports = router;