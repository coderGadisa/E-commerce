const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user._id);
  res.json(new ApiResponse(true, "Profile retrieved successfully", user));
});

// @desc    Update user profile (name, email, address, password)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  res.json(new ApiResponse(true, "Profile updated successfully", user));
});

// @desc    Upload / replace avatar image
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatarHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }
  const updated = await userService.uploadAvatar(req.user._id, req.file.buffer);
  res.json(new ApiResponse(true, "Avatar updated successfully", updated));
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.getWishlist(req.user._id);
  res.json(new ApiResponse(true, "Wishlist retrieved successfully", wishlist));
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.addToWishlist(req.user._id, req.params.productId);
  res.json(new ApiResponse(true, "Product added to wishlist successfully", wishlist));
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.removeFromWishlist(req.user._id, req.params.productId);
  res.json(new ApiResponse(true, "Product removed from wishlist successfully", wishlist));
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatarHandler,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};