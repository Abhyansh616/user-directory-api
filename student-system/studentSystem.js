require("dotenv").config();

const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

const courseSchema = new mongoose.Schema({
  title: String,
  credits: Number
});

const studentSchema = new mongoose.Schema({
  name: String,
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ]
});

const Course = mongoose.model("Course", courseSchema);

const Student = mongoose.model("Student", studentSchema);


// Temporary seed function — already used, so don't call it again
async function seedDatabase() {
  try {
    const courses = await Course.insertMany([
      {
        title: "JavaScript",
        credits: 4
      },
      {
        title: "Database Management",
        credits: 3
      },
      {
        title: "Computer Networks",
        credits: 4
      }
    ]);

    const student = await Student.create({
      name: "Abhyansh",
      enrolledCourses: [
        courses[0]._id,
        courses[1]._id
      ]
    });

    console.log("Seed data inserted successfully");
    console.log(student);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  }
}


function getStudentProfile(studentId) {
  Student.findById(studentId)
    .then(student => {
      if (!student) {
        throw new Error("Student not found");
      }

      return Course.find({
        _id: { $in: student.enrolledCourses }
      })
      .then(courses => {
        return {
          name: student.name,
          courses: courses
        };
      });
    })
    .then(profile => {
      console.log("Student Profile:");
      console.log(profile);
    })
    .catch(error => {
      console.error(
        "Error fetching student profile:",
        error.message
      );
    });
}


function getMultipleCourses(courseIds) {
  const coursePromises = courseIds.map(id => {
    return Course.findById(id);
  });

  Promise.all(coursePromises)
    .then(courses => {
      console.log("Multiple Courses:");
      console.log(courses);
    })
    .catch(error => {
      console.error(
        "Error fetching multiple courses:",
        error.message
      );
    });
}

async function start() {
  await connectDatabase();

  getStudentProfile("6a808117fe144e4727797abc");

  getMultipleCourses([
    "6a808116fe144e4727797ab9",
    "6a808116fe144e4727797aba"
  ]);
}

start();