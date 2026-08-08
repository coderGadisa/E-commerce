const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ApiError = require("../utils/ApiError");

const SHIPPING_THRESHOLD = 5000; // Free shipping above this amount (ETB)
const SHIPPING_PRICE = 200;

const createOrder = async (userId, { items, shippingAddress, paymentMethod }) => {
  if (!items || items.length === 0) {
    throw new ApiError(400, "No order items provided");
  }

  // Verify products exist and calculate totals
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new ApiError(404, `Product not found: ${item.product}`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      };
    })
  );

  const itemsTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const totalPrice = itemsTotal + shippingPrice;

  // Deduct stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart after ordering
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "cash_on_delivery",
    itemsTotal,
    shippingPrice,
    totalPrice,
  });

  return order;
};

const getMyOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

const getOrderById = async (orderId, userId, role) => {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) throw new ApiError(404, "Order not found");

  // Users can only see their own orders
  if (role !== "admin" && order.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  return order;
};

const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

const updateOrderStatus = async (orderId, { orderStatus, paymentStatus }) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  if (orderStatus === "delivered") {
    order.deliveredAt = new Date();
    order.paymentStatus = "paid";
  }

  await order.save();
  return order;
};

const cancelOrder = async (orderId, userId, role) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (role !== "admin" && order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  if (order.orderStatus === "delivered") {
    throw new ApiError(400, "Cannot cancel a delivered order");
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "cancelled";
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
