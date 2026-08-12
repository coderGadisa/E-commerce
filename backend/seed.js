const mongoose = require("mongoose");
const dns = require("dns");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// Same DNS fix as db.js — local 127.0.0.1 DNS refuses Node's SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Using Unsplash CDN — stable permanent photo URLs matched to each product type
const products = [
  {
    name: "HP Pavilion Laptop 15",
    category: "Laptop",
    description: "15.6-inch Full HD IPS display, Intel Core i5-12th Gen, 8GB RAM, 512GB SSD, Windows 11. Perfect for work and study.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    price: 65000,
    stock: 15,
  },
  {
    name: "MacBook Air M2",
    category: "Laptop",
    description: "Apple M2 chip, 13.6-inch Liquid Retina display, 8GB unified memory, 256GB SSD. All-day battery life up to 18 hours.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    price: 145000,
    stock: 8,
  },
  {
    name: "Dell Inspiron 15",
    category: "Laptop",
    description: "Intel Core i7, 16GB RAM, 1TB SSD, NVIDIA GeForce RTX 3050. Ideal for light gaming and professional work.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    price: 85000,
    stock: 10,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Phone",
    description: "6.8-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 200MP camera, 5000mAh battery.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
    price: 98000,
    stock: 20,
  },
  {
    name: "iPhone 15 Pro",
    category: "Phone",
    description: "6.1-inch Super Retina XDR, A17 Pro chip, 48MP camera system, USB-C, Titanium design. iOS 17.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    price: 120000,
    stock: 12,
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    category: "Phone",
    description: "6.67-inch AMOLED, Dimensity 7200-Ultra, 12GB RAM, 256GB, 200MP camera. Flagship features at mid-range price.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
    price: 32000,
    stock: 30,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    category: "Accessories",
    description: "Industry-leading noise cancellation, 30-hour battery, multipoint connection, premium sound quality for audiophiles.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    price: 18000,
    stock: 25,
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    category: "Accessories",
    description: "Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, MagSafe Charging Case. H2 chip.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
    price: 22000,
    stock: 18,
  },
  {
    name: "Logitech MX Master 3S Mouse",
    category: "Accessories",
    description: "8K DPI sensor, ultra-fast MagSpeed scroll, ergonomic design, Bluetooth + USB, works on any surface including glass.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    price: 7500,
    stock: 40,
  },
  {
    name: "LG UltraWide 34\" Monitor",
    category: "Monitor",
    description: "34-inch IPS, 3440x1440 UWQHD, 160Hz, 1ms, HDR10, USB-C 96W charging. Ideal for multitasking and creative work.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    price: 55000,
    stock: 7,
  },
  {
    name: "Samsung 27\" Odyssey G5",
    category: "Monitor",
    description: "27-inch QHD curved gaming monitor, 165Hz, 1ms, AMD FreeSync Premium. Immersive gaming experience.",
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80",
    price: 35000,
    stock: 9,
  },
  {
    name: "Apple Watch Series 9",
    category: "Smart Watch",
    description: "45mm Always-On Retina display, S9 chip, health monitoring, crash detection, double tap gesture, Carbon Neutral.",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
    price: 42000,
    stock: 14,
  },
  {
    name: "Samsung Galaxy Watch 6",
    category: "Smart Watch",
    description: "44mm Super AMOLED, advanced health tracking, sleep coaching, Exynos W930, up to 40 hours battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    price: 28000,
    stock: 16,
  },
  {
    name: "Anker 20000mAh Power Bank",
    category: "Accessories",
    description: "20000mAh, 65W fast charging, PowerIQ 3.0, charge 3 devices simultaneously. Compact and airline-approved.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
    price: 4500,
    stock: 50,
  },
  {
    name: "Mechanical Gaming Keyboard",
    category: "Accessories",
    description: "TKL layout, Cherry MX Red switches, per-key RGB, anti-ghosting, N-key rollover. For competitive gaming.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    price: 6500,
    stock: 22,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products`);

    // Verify images are accessible URLs
    console.log("\nSample image URLs:");
    inserted.slice(0, 3).forEach(p => console.log(`  ${p.name}: ${p.image}`));

    mongoose.disconnect();
    console.log("\nDone.");
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
