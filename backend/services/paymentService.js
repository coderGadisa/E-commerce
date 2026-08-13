const https = require("https");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");

const CHAPA_BASE_URL = "https://api.chapa.co/v1"; // kept for reference

// ─────────────────────────────────────────────────────────
// Internal helper — makes HTTPS requests to Chapa REST API
// without requiring an extra npm package
// ─────────────────────────────────────────────────────────
const chapaRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    // Read at call time so key rotation takes effect without restart
    const secretKey = process.env.CHAPA_SECRET_KEY;
    if (!secretKey) {
      return reject(new Error("CHAPA_SECRET_KEY is not configured"));
    }

    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: "api.chapa.co",
      path: `/v1${path}`,
      method,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        ...(payload && { "Content-Length": Buffer.byteLength(payload) }),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          reject(new Error(`Chapa response parse error: ${data}`));
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
};

// ─────────────────────────────────────────────────────────
// Generate a unique transaction reference
// Format: TX-<orderId-last8>-<timestamp>-<random4>
// ─────────────────────────────────────────────────────────
const generateTxRef = (orderId) => {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const ts = Date.now();
  const shortId = orderId.toString().slice(-8).toUpperCase();
  return `TX-${shortId}-${ts}-${suffix}`;
};

// ─────────────────────────────────────────────────────────
// initializePayment
//
// Called after an order is created with paymentMethod
// "card" or "mobile_money".
//
// 1. Generates a unique txRef
// 2. Saves txRef to the order document
// 3. Calls Chapa /transaction/initialize
// 4. Returns the Chapa checkout_url for frontend redirect
// ─────────────────────────────────────────────────────────
const initializePayment = async (orderId, userEmail, userName) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order is already paid");
  }

  const txRef = generateTxRef(orderId);

  // Persist txRef on the order so we can look it up on callback
  order.txRef = txRef;
  await order.save();

  const firstName = userName?.split(" ")[0] || "Customer";
  const lastName = userName?.split(" ").slice(1).join(" ") || "TechStore";

  const returnUrl = `${process.env.CLIENT_URL}/payment/verify?tx_ref=${txRef}&order_id=${orderId}`;

  const body = {
    amount: order.totalPrice.toString(),
    currency: "ETB",
    email: userEmail,
    first_name: firstName,
    last_name: lastName,
    tx_ref: txRef,
    callback_url: returnUrl,
    return_url: returnUrl,
    customization: {
      title: "TechStore Payment",
      description: `Payment for order #${orderId.toString().slice(-8).toUpperCase()}`,
    },
  };

  const { status, data } = await chapaRequest("POST", "/transaction/initialize", body);

  if (status !== 200 || data.status !== "success") {
    // Roll back txRef if Chapa rejected the request
    order.txRef = null;
    await order.save();
    throw new ApiError(502, data?.message || "Payment initialization failed");
  }

  return {
    txRef,
    checkoutUrl: data.data.checkout_url,
    orderId: order._id,
  };
};

// ─────────────────────────────────────────────────────────
// verifyPayment
//
// Called when the user returns from Chapa's hosted page.
//
// 1. Looks up the order by txRef
// 2. Calls Chapa GET /transaction/verify/:tx_ref
// 3. If Chapa says "success" → marks order paymentStatus "paid"
// 4. If Chapa says anything else → marks paymentStatus "failed"
// 5. Returns the updated order
// ─────────────────────────────────────────────────────────
const verifyPayment = async (txRef) => {
  if (!txRef) throw new ApiError(400, "Transaction reference is required");

  // Find the order that owns this txRef
  const order = await Order.findOne({ txRef });
  if (!order) throw new ApiError(404, "Order not found for this transaction");

  // Already processed — return current state without re-calling Chapa
  if (order.paymentStatus === "paid") {
    return { order, alreadyVerified: true };
  }

  const { status, data } = await chapaRequest(
    "GET",
    `/transaction/verify/${encodeURIComponent(txRef)}`
  );

  const chapaStatus = data?.data?.status;

  if (status === 200 && chapaStatus === "success") {
    order.paymentStatus = "paid";
    await order.save();
    return { order, alreadyVerified: false };
  }

  // Payment failed or was cancelled
  order.paymentStatus = "failed";
  await order.save();

  const reason = data?.message || chapaStatus || "Payment was not completed";
  throw new ApiError(402, reason);
};

module.exports = { initializePayment, verifyPayment, generateTxRef };
