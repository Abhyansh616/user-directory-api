const checkSelfAccess = (req, res, next) => {
  if (req.user.role === "student") {
    if (!req.user.studentId) {
      return res.status(403).json({
        error: "ABAC Denied: Student account is not linked to a student record."
      });
    }

    if (req.params.id !== req.user.studentId.toString()) {
      return res.status(403).json({
        error: "ABAC Denied: Students can only access their own record."
      });
    }
  }

  next();
};

module.exports = checkSelfAccess;