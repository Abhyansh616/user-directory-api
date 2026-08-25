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
  deleteStudent,
  bulkUploadStudents
} = require("../controllers/studentController");

const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const checkGradeAccess = require("../middleware/checkGradeAccess");
const checkSelfAccess = require("../middleware/checkSelfAccess");
const validateRequest = require("../middleware/validateRequest");

const {
  studentSchema
} = require("../validations/studentValidation");

const loginRateLimiter = require("../middleware/loginRateLimiter");

router.get("/login", getLoginPage);

router.get("/", home);

router.post("/register", registerUser);

router.post("/login", loginRateLimiter, loginUser);

router.get(
  "/users",
  authenticateToken,
  getUsers
);

router.post(
  "/students",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  validateRequest(studentSchema),
  createStudent
);

router.post(
  "/students/bulk-upload",
  authenticateToken,
  authorizeRoles("admin"),
  bulkUploadStudents
);

router.get(
  "/students",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  getStudents
);

router.get(
  "/students/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher", "student"),
  checkGradeAccess,
  checkSelfAccess,
  getStudentById
);

router.put(
  "/students/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  validateRequest(studentSchema),
  checkGradeAccess,
  updateStudent
);

router.delete(
  "/students/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteStudent
);

module.exports = router;