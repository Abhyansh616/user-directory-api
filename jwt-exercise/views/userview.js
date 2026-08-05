exports.homeResponse = (res) => {
  res.send("Welcome to the User Directory API!");
};

exports.usersResponse = (res, username, users) => {
  res.json({
    message: `Welcome ${username}!`,
    users
  });
};

exports.createdUserResponse = (res, newUser) => {
  res.status(201).json(newUser);
};

exports.loginSuccess = (res, token) => {
  res.status(200).json({
    message: "Login successful",
    token
  });
};

exports.loginFailed = (res) => {
  res.status(401).json({
    error: "Invalid username or password"
  });
};