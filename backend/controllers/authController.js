const asyncHandler = require("../utils/asyncHandler");
const { registerUser, loginUser } = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(new ApiResponse(true, "Registration successful", result));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(new ApiResponse(true, "Login successful", result));
});

module.exports = { register, login };
