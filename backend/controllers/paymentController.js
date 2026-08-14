const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/paymentService");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// @desc    Initialize a Chapa payment for an existing order
// @route   POST /api/payment/initialize
// @access  Private
const initializePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new ApiError(400, "orderId is required");
  }

  const result = await paymentService.initializePayment(
    orderId,
    req.user.email,
    req.user.name,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(true, "Payment initialized", {
      checkoutUrl: result.checkoutUrl,
      txRef: result.txRef,
      orderId: result.orderId,
    })
  );
});

// @desc    Verify a Chapa payment after user returns from Chapa hosted page
// @route   GET /api/payment/verify?tx_ref=TX-...
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { tx_ref } = req.query;

  if (!tx_ref) {
    throw new ApiError(400, "tx_ref query parameter is required");
  }

  const { order, alreadyVerified } = await paymentService.verifyPayment(tx_ref);

  const message = alreadyVerified
    ? "Payment already verified"
    : "Payment verified successfully";

  res.status(200).json(
    new ApiResponse(true, message, {
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      totalPrice: order.totalPrice,
      txRef: order.txRef,
    })
  );
});

module.exports = { initializePayment, verifyPayment };
