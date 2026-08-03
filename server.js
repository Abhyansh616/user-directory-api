const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 3000;

app.use(express.json());

const SECRET_KEY = "my_super_secret_key_123";

let users = [
  {
    id: 1,
    name: "Alice",
    username: "admin",
    password: "password123"
  },
  {
    id: 2,
    name: "Bob",
    username: "student",
    password: "learn2code"
  }
];


// Previous task middleware
function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}


function validateUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  next();
}


app.use(requestLogger);



app.get("/", (req, res) => {
  res.send("Welcome to the User Directory API!");
});


app.get("/users", authenticateToken, (req, res) => {

  res.json({
    message: `Welcome ${req.user.username}!`,
    users: users
  });

});


// Create user route
app.post("/users", validateUser, (req, res) => {

  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);

  res.status(201).json(newUser);

});


// JWT LOGIN ROUTE
app.post("/login", (req, res) => {

  const { username, password } = req.body;


  const user = users.find(
    u => u.username === username && u.password === password
  );


  if (!user) {
    return res.status(401).json({
      error: "Invalid username or password"
    });
  }


  const payload = {
    id: user.id,
    username: user.username
  };


  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h"
  });


  res.status(200).json({
    message: "Login successful",
    token: token
  });

});


// JWT AUTHENTICATION MIDDLEWARE
function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];


  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided."
    });
  }


  jwt.verify(token, SECRET_KEY, (err, decodedData) => {

    if (err) {
      return res.status(403).json({
        error: "Invalid or expired token."
      });
    }


    req.user = decodedData;

    next();

  });

}


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});