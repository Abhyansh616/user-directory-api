const jwt = require("jsonwebtoken");

const { users, SECRET_KEY } = require("../models/userModel");

const userView = require("../views/userView");

const home = (req, res) => {
  userView.homeResponse(res);
};

const getUsers = (req, res) => {
  userView.usersResponse(
    res,
    req.user.username,
    users
  );
};

const createUser = (req, res) => {

  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);

  userView.createdUserResponse(res, newUser);

};

const loginUser = (req, res) => {

  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {

    return userView.loginFailed(res);

  }

  const payload = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h"
  });

  userView.loginSuccess(res, token);

};

module.exports = {
  home,
  getUsers,
  createUser,
  loginUser
};