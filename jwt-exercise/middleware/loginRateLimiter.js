const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: {
    error: "Too many login attempts, please try again later."
  }
});

module.exports = loginRateLimiter; 