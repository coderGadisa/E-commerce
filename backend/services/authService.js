const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const emailService = require("./emailService");

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  // User model pre-save hook handles hashing — do NOT hash here
  const user = await User.create({ name, email, password });

  // Send welcome email — fire-and-forget, never blocks registration
  emailService.sendWelcomeEmail({ name: user.name, email: user.email });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id, user.role),
  };
};

module.exports = { registerUser, loginUser };
