const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Override Node's DNS servers — local 127.0.0.1 DNS refuses connections
    // so we explicitly use Google and Cloudflare public DNS
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;