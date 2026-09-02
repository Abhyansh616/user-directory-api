const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
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
      totalPages
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
  const filePath = req.file?.path;
  const socketId = req.body.socketId;
  const io = req.app.get("io");

  if (!req.file) {
    return res.status(400).json({
      error: "CSV file is required"
    });
  }

  if (!socketId) {
    if (filePath) {
      fs.unlink(filePath, () => {});
    }

    return res.status(400).json({
      error: "socketId is required"
    });
  }

  const CHUNK_SIZE = 50;

  let totalProcessed = 0;
  let successCount = 0;
  let failedCount = 0;
  let chunk = [];
  let processing = Promise.resolve();

  const emitProgress = () => {
    io.to(socketId).emit("upload_progress", {
      totalProcessed,
      successCount,
      failedCount
    });
  };

  const insertChunk = async () => {
    if (chunk.length === 0) {
      return;
    }

    const currentChunk = chunk;
    chunk = [];

    try {
      const insertedStudents = await Student.insertMany(
        currentChunk,
        {
          ordered: false
        }
      );

      successCount += insertedStudents.length;
    } catch (error) {
      if (error.insertedDocs) {
        successCount += error.insertedDocs.length;
      }

      failedCount += currentChunk.length -
        (error.insertedDocs?.length || 0);
    }

    emitProgress();
  };

  try {
    const stream = fs
      .createReadStream(filePath)
      .pipe(csv());

    stream.on("data", (row) => {
      stream.pause();

      processing = processing
        .then(async () => {
          totalProcessed++;

          const name = row.name?.trim();
          const age = Number(row.age);
          const grade = row.grade?.trim();

          const isValid =
            name &&
            name.length >= 3 &&
            Number.isInteger(age) &&
            age > 0 &&
            grade;

          if (!isValid) {
            failedCount++;

            return;
          }

          chunk.push({
            name,
            age,
            grade,
            isActive: true
          });

          if (chunk.length >= CHUNK_SIZE) {
            await insertChunk();
          }
        })
        .finally(() => {
          stream.resume();
        });
    });

    stream.on("end", async () => {
      try {
        await processing;
        await insertChunk();

        io.to(socketId).emit("upload_complete", {
          totalProcessed,
          successCount,
          failedCount
        });

        fs.unlink(filePath, () => {});

        res.status(201).json({
          message: "CSV upload completed successfully",
          totalProcessed,
          successCount,
          failedCount
        });
      } catch (error) {
        fs.unlink(filePath, () => {});

        io.to(socketId).emit("upload_complete", {
          totalProcessed,
          successCount,
          failedCount,
          error: "Upload failed"
        });

        if (!res.headersSent) {
          res.status(500).json({
            error: "Bulk upload failed",
            message: error.message
          });
        }
      }
    });

    stream.on("error", (error) => {
      fs.unlink(filePath, () => {});

      if (!res.headersSent) {
        res.status(500).json({
          error: "CSV processing failed",
          message: error.message
        });
      }
    });
  } catch (error) {
    if (filePath) {
      fs.unlink(filePath, () => {});
    }

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