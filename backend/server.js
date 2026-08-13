// Load environment variables FIRST — before any other require()
// so that process.env is populated when cloudinary, db, etc. initialise
require("dotenv").config();

// ── Global DNS fix ────────────────────────────────────────────────────────────
// On some networks (corporate, university, local dev) Node's default DNS
// resolver (127.0.0.1) refuses or times out on SRV/A lookups.
// We override it once here so ALL outbound requests in this process
// (MongoDB Atlas, Chapa API, Cloudinary, etc.) use working resolvers.
// Priority: MONGO_DNS env var → non-loopback system DNS → public fallbacks.
// On Render (production) system DNS works fine so this is a safe no-op there.
const dns = require("dns");
{
  const envDns = process.env.MONGO_DNS
    ? process.env.MONGO_DNS.split(",").map((s) => s.trim())
    : [];
  const system = dns
    .getServers()
    .filter((s) => !s.startsWith("127.") && s !== "::1");
  const all = [...envDns, ...system, "8.8.8.8", "1.1.1.1"];
  dns.setServers(all.filter((s, i) => all.indexOf(s) === i));
}
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");
const path = require("path");

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

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Tech Electronics Store API Running ✓" });
});

// 404 and global error handler — must be last
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
