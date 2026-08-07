const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
} = require("../controllers/productController");

// Public routes
// NOTE: /categories/all must be defined BEFORE /:id
// otherwise Express matches "categories" as the :id param
router.get("/categories/all", getCategories);
router.get("/",               getProducts);
router.get("/:id",            getProductById);

module.exports = router;
