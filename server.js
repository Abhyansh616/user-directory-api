const express = require("express");
const path = require("path"); 

const app = express();
const PORT = 3000;

const requestLogger = require("./middleware/requestLogger");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public"))); 

// Set EJS as the view engine
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.use(requestLogger);

app.use("/", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
