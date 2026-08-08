const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getReviews,
  addReview,
  deleteReview,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// NOTE: /categories/all must come BEFORE /:id
// otherwise Express matches "categories" as the :id param
router.get("/categories/all", getCategories);
router.get("/",               getProducts);
router.get("/:id",            getProductById);

// Reviews
router.get("/:id/reviews",                    getReviews);
router.post("/:id/reviews",     protect,      addReview);
router.delete("/:id/reviews/:reviewId", protect, deleteReview);

module.exports = router;
