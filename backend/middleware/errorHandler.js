const errorHandler = (err, req, res, next) => {
  // Always log internally — never expose stack traces to the client
  console.error(`[ERROR] ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose: bad ObjectId (e.g. /api/products/not-a-valid-id)
  // Do NOT reflect err.value back — it mirrors attacker input
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Mongoose: duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    statusCode = 409;
    message = `${field} already exists`;
  }

  // Mongoose: schema validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors — handled here as a safety net;
  // authMiddleware already catches these before they reach this handler
  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token"; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired"; }

  // In production, replace any unhandled 500 message with a generic string
  // so internal implementation details are never exposed
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
