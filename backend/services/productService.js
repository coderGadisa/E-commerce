const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const getAllProducts = async (query = {}) => {
  const {
    keyword = "",
    category = "",
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = query;

  const filter = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: "i" };
  }
  if (category && category !== "All") {
    filter.category = category;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const getCategories = async () => {
  return await Product.distinct("category");
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  return { message: "Product deleted" };
};

// ── Reviews ──────────────────────────────────────────────────────────

const addReview = async (productId, userId, userName, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // One review per user
  const alreadyReviewed = product.reviews.some(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) {
    throw new ApiError(409, "You have already reviewed this product");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }
  if (!comment || comment.trim().length === 0) {
    throw new ApiError(400, "Comment is required");
  }

  const review = {
    user:    userId,
    name:    userName,
    rating:  Number(rating),
    comment: comment.trim(),
  };

  product.reviews.push(review);

  // Recompute averageRating and numReviews
  product.numReviews    = product.reviews.length;
  product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();

  const saved = product.reviews[product.reviews.length - 1];
  return {
    review:        saved,
    averageRating: product.averageRating,
    numReviews:    product.numReviews,
  };
};

const getReviews = async (productId) => {
  const product = await Product.findById(productId).select("reviews averageRating numReviews name");
  if (!product) throw new ApiError(404, "Product not found");
  return {
    reviews:       product.reviews.sort((a, b) => b.createdAt - a.createdAt),
    averageRating: product.averageRating,
    numReviews:    product.numReviews,
  };
};

const deleteReview = async (productId, reviewId, userId, role) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const review = product.reviews.id(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  // Only the review author or an admin can delete
  if (role !== "admin" && review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  product.reviews.pull(reviewId);

  // Recompute
  product.numReviews    = product.reviews.length;
  product.averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  await product.save();
  return { message: "Review deleted" };
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  deleteReview,
};
