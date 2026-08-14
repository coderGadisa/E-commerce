const jwt = require("jsonwebtoken");

// Only embed the user ID in the JWT — role is always loaded fresh
// from the database in authMiddleware, so embedding it in the token
// is unnecessary and leaks information.
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d", algorithm: "HS256" }
  );
};

module.exports = generateToken;
