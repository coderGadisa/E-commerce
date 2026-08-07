const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// ======================================
// All routes below require authentication
// ======================================

router.use(protect);

// ======================================
// Profile
// ======================================

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

// ======================================
// Wishlist
// ======================================

router.get("/wishlist", getWishlist);

router.post("/wishlist/:productId", addToWishlist);

router.delete("/wishlist/:productId", removeFromWishlist);

// ======================================
// Test Route
// ======================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "User routes are working",
  });
});

module.exports = router;