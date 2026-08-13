const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/payment/initialize — create Chapa checkout session for an order
// Protected: user must be logged in (owns the order)
router.post("/initialize", protect, initializePayment);

// GET /api/payment/verify?tx_ref=TX-...
// Chapa redirects the user back here after payment attempt
// Protected: user must be logged in
router.get("/verify", protect, verifyPayment);

module.exports = router;
