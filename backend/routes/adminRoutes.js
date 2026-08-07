const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require("../controllers/adminController");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.use(protect, adminOnly);

// Dashboard
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

// Products (admin-only mutations)
router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
