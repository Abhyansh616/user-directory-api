const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student"
  },

  assignedGrade: {
    type: String
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;