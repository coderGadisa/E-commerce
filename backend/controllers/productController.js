const asyncHandler = require("../utils/asyncHandler");
const productService = require("../services/productService");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res.json(
    new ApiResponse(true, "Products retrieved", result.products, result.total)
  );
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(new ApiResponse(true, "Product retrieved", product));
});

// @desc    Get all distinct categories
// @route   GET /api/products/categories/all
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.json(new ApiResponse(true, "Categories retrieved", categories));
});

// @desc    Create product (admin only — called via /api/admin/products)
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = `uploads/${req.file.filename}`;
  }
  const product = await productService.createProduct(data);
  res.status(201).json(new ApiResponse(true, "Product created", product));
});

// @desc    Update product (admin only — called via /api/admin/products/:id)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = `uploads/${req.file.filename}`;
  }
  const product = await productService.updateProduct(req.params.id, data);
  res.json(new ApiResponse(true, "Product updated", product));
});

// @desc    Delete product (admin only — called via /api/admin/products/:id)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.json(new ApiResponse(true, result.message, null));
});

// ── Reviews ────────────────────────────────────────────────────────

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const data = await productService.getReviews(req.params.id);
  res.json(new ApiResponse(true, "Reviews retrieved", data, data.numReviews));
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const data = await productService.addReview(
    req.params.id,
    req.user._id,
    req.user.name,
    req.body
  );
  res.status(201).json(new ApiResponse(true, "Review submitted", data));
});

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private (own review) or Admin
const deleteReview = asyncHandler(async (req, res) => {
  const result = await productService.deleteReview(
    req.params.id,
    req.params.reviewId,
    req.user._id,
    req.user.role
  );
  res.json(new ApiResponse(true, result.message, null));
});

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  deleteReview,
};
