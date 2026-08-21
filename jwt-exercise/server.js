require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

const requestLogger = require("./middleware/requestLogger");
const userRoutes = require("./routes/userRoutes");

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*"
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    error: "Too many requests, please try again later."
  }
});

app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb"
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(requestLogger);

app.use("/", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });