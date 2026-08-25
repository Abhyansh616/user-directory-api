const Student = require("../models/studentModel");

const checkGradeAccess = async (req, res, next) => {
  try {
    // Admins bypass ABAC grade checking
    if (req.user.role === "admin") {
      return next();
    }

    // Only teachers need grade-based checking
    if (req.user.role === "teacher") {
      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          error: "Student not found"
        });
      }

      if (req.user.assignedGrade !== student.grade) {
        return res.status(403).json({
          error: "ABAC Denied: You are only authorized to manage students in your assigned grade."
        });
      }

      return next();
    }

    // Students should be handled by checkSelfAccess
    return next();

  } catch (error) {
    return res.status(500).json({
      error: "ABAC grade check failed",
      message: error.message
    });
  }
};

module.exports = checkGradeAccess;