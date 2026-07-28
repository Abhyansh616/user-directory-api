const express = require("express");

const app = express();

const PORT = 3000;
app.use(express.json());
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
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
app.get("/users", (req, res) => {
  res.json(users);
});
app.post("/users", validateUser, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);

  res.status(201).json(newUser);
});
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});