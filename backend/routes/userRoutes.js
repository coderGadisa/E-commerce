const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const {
  getProfile,
  updateProfile,
  uploadAvatarHandler,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { profileUpdateValidationRules } = require("../validators/authValidator");
const upload = require("../config/multer");
const ApiError = require("../utils/ApiError");

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(", ");
    return next(new ApiError(400, messages));
  }
  next();
};

router.use(protect);

// Profile
router.get("/profile", getProfile);
router.put("/profile", profileUpdateValidationRules, handleValidation, updateProfile);

// Avatar — uses same multer (memoryStorage + image-only + 5MB) as product images
// Cloudinary upload happens inside userService.uploadAvatar
router.post("/avatar", upload.single("avatar"), uploadAvatarHandler);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

module.exports = router;
