const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
const orderService = require("../services/orderService");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(
    new ApiResponse(true, "Users retrieved", users, users.length)
  );
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(new ApiResponse(true, result.message, null));
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(
    new ApiResponse(true, "Orders retrieved", orders, orders.length)
  );
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body
  );
  res.json(new ApiResponse(true, "Order updated", order));
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, orders] = await Promise.all([
    userService.getAllUsers(),
    orderService.getAllOrders(),
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) =>
      order.orderStatus !== "cancelled" ? sum + order.totalPrice : sum,
    0
  );

  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders: orders.filter((o) => o.orderStatus === "processing")
      .length,
    completedOrders: orders.filter((o) => o.orderStatus === "delivered")
      .length,
  };

  res.json(new ApiResponse(true, "Stats retrieved", stats));
});

module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
