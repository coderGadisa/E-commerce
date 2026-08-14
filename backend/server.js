// ── Environment variables — MUST be first ────────────────────────────────────
require("dotenv").config();

// ── Global DNS fix ────────────────────────────────────────────────────────────
// Overrides Node's DNS resolver once so ALL outbound requests
// (MongoDB Atlas, Chapa, Cloudinary) use a working resolver.
// Priority: MONGO_DNS env var → non-loopback system DNS → public fallbacks.
// On Render (production) system DNS is fine — this is a safe no-op there.
const dns = require("dns");
{
  const envDns = process.env.MONGO_DNS
    ? process.env.MONGO_DNS.split(",").map((s) => s.trim())
    : [];
  const system = dns.getServers().filter((s) => !s.startsWith("127.") && s !== "::1");
  const all = [...envDns, ...system, "8.8.8.8", "1.1.1.1"];
  dns.setServers(all.filter((s, i) => all.indexOf(s) === i));
}
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production only the Vercel frontend is allowed.
// In development both localhost ports are allowed.
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5174");
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Strict limit on auth routes to prevent brute-force and registration spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,             // max 20 auth requests per window per IP
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter — generous limit to allow normal usage
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Body parsers with explicit size limits ────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── NoSQL injection protection ────────────────────────────────────────────────
// Strips $ and . from request body, query, and params
app.use(mongoSanitize());

// ── HTTP Parameter Pollution protection ──────────────────────────────────────
app.use(hpp());

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/cart", apiLimiter, cartRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/payment", apiLimiter, paymentRoutes);

// NOTE: /uploads static route removed — Cloudinary is used in production.
// Local seed images (laptop1.jpg etc.) are no longer served.

app.get("/", (req, res) => {
  res.json({ message: "Tech Electronics Store API Running ✓" });
});

// ── 404 + global error handler — must be last ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
