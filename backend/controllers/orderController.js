const asyncHandler = require("../utils/asyncHandler");
const orderService = require("../services/orderService");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res
    .status(201)
    .json(new ApiResponse(true, "Order created", order));
});

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  res.json(
    new ApiResponse(true, "Orders retrieved", orders, orders.length)
  );
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  res.json(new ApiResponse(true, "Order retrieved", order));
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.params.id,
    req.user._id,
    req.user.role
  );
  res.json(new ApiResponse(true, "Order cancelled", order));
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
