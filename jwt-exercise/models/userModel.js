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

module.exports = {
  users,
  SECRET_KEY
};