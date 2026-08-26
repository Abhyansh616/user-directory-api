const Student = require("../models/studentModel");

const createStudent = async (req, res) => {
  try {
    const { name, age, grade, isActive } = req.body;

    const student = await Student.create({
      name,
      age,
      grade,
      isActive
    });

    res.status(201).json({
      message: "Student created successfully",
      student
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create student",
      message: error.message
    });
  }
};

// READ ALL - GET /students
const getStudents = async (req, res) => {
  try {
    const { grade, isActive } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filterObject = {};

    if (grade) {
      filterObject.grade = grade;
    }

    if (isActive !== undefined) {
      filterObject.isActive = isActive === "true";
    }

    const skipValue = (page - 1) * limit;

    const students = await Student.find(filterObject)
      .skip(skipValue)
      .limit(limit);

    const totalStudents = await Student.countDocuments(filterObject);
    const totalPages = Math.ceil(totalStudents / limit);

    res.json({
      students,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch students",
      message: error.message
    });
  }
};


const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID"
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update student",
      message: error.message
    });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully",
      student
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID"
    });
  }
};
const bulkUploadStudents = async (req, res) => {
  try {
    const students = req.body.students;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        error: "students must be a non-empty array"
      });
    }

    const createdStudents = await Student.insertMany(students);

    res.status(201).json({
      message: "Students uploaded successfully",
      count: createdStudents.length,
      students: createdStudents
    });
  } catch (error) {
    res.status(500).json({
      error: "Bulk upload failed",
      message: error.message
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkUploadStudents
};