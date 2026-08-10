const mongoose = require("mongoose");
const dns = require("dns");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// Same DNS fix as db.js — local 127.0.0.1 DNS refuses Node's SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Using picsum.photos — a free, stable, CORS-friendly image CDN
// Each URL returns a deterministic image based on the seed number
const products = [
  {
    name: "HP Pavilion Laptop 15",
    category: "Laptop",
    description: "15.6-inch Full HD IPS display, Intel Core i5-12th Gen, 8GB RAM, 512GB SSD, Windows 11. Perfect for work and study.",
    image: "https://picsum.photos/seed/laptop1/600/400",
    price: 65000,
    stock: 15,
  },
  {
    name: "MacBook Air M2",
    category: "Laptop",
    description: "Apple M2 chip, 13.6-inch Liquid Retina display, 8GB unified memory, 256GB SSD. All-day battery life up to 18 hours.",
    image: "https://picsum.photos/seed/macbook/600/400",
    price: 145000,
    stock: 8,
  },
  {
    name: "Dell Inspiron 15",
    category: "Laptop",
    description: "Intel Core i7, 16GB RAM, 1TB SSD, NVIDIA GeForce RTX 3050. Ideal for light gaming and professional work.",
    image: "https://picsum.photos/seed/dell15/600/400",
    price: 85000,
    stock: 10,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Phone",
    description: "6.8-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 200MP camera, 5000mAh battery.",
    image: "https://picsum.photos/seed/s24ultra/600/400",
    price: 98000,
    stock: 20,
  },
  {
    name: "iPhone 15 Pro",
    category: "Phone",
    description: "6.1-inch Super Retina XDR, A17 Pro chip, 48MP camera system, USB-C, Titanium design. iOS 17.",
    image: "https://picsum.photos/seed/iphone15/600/400",
    price: 120000,
    stock: 12,
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    category: "Phone",
    description: "6.67-inch AMOLED, Dimensity 7200-Ultra, 12GB RAM, 256GB, 200MP camera. Flagship features at mid-range price.",
    image: "https://picsum.photos/seed/redmi13/600/400",
    price: 32000,
    stock: 30,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    category: "Accessories",
    description: "Industry-leading noise cancellation, 30-hour battery, multipoint connection, premium sound quality for audiophiles.",
    image: "https://picsum.photos/seed/sonyxm5/600/400",
    price: 18000,
    stock: 25,
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    category: "Accessories",
    description: "Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, MagSafe Charging Case. H2 chip.",
    image: "https://picsum.photos/seed/airpodspro/600/400",
    price: 22000,
    stock: 18,
  },
  {
    name: "Logitech MX Master 3S Mouse",
    category: "Accessories",
    description: "8K DPI sensor, ultra-fast MagSpeed scroll, ergonomic design, Bluetooth + USB, works on any surface including glass.",
    image: "https://picsum.photos/seed/mxmaster/600/400",
    price: 7500,
    stock: 40,
  },
  {
    name: "LG UltraWide 34\" Monitor",
    category: "Monitor",
    description: "34-inch IPS, 3440x1440 UWQHD, 160Hz, 1ms, HDR10, USB-C 96W charging. Ideal for multitasking and creative work.",
    image: "https://picsum.photos/seed/lgultrawide/600/400",
    price: 55000,
    stock: 7,
  },
  {
    name: "Samsung 27\" Odyssey G5",
    category: "Monitor",
    description: "27-inch QHD curved gaming monitor, 165Hz, 1ms, AMD FreeSync Premium. Immersive gaming experience.",
    image: "https://picsum.photos/seed/odysseyg5/600/400",
    price: 35000,
    stock: 9,
  },
  {
    name: "Apple Watch Series 9",
    category: "Smart Watch",
    description: "45mm Always-On Retina display, S9 chip, health monitoring, crash detection, double tap gesture, Carbon Neutral.",
    image: "https://picsum.photos/seed/applewatch9/600/400",
    price: 42000,
    stock: 14,
  },
  {
    name: "Samsung Galaxy Watch 6",
    category: "Smart Watch",
    description: "44mm Super AMOLED, advanced health tracking, sleep coaching, Exynos W930, up to 40 hours battery life.",
    image: "https://picsum.photos/seed/galaxywatch6/600/400",
    price: 28000,
    stock: 16,
  },
  {
    name: "Anker 20000mAh Power Bank",
    category: "Accessories",
    description: "20000mAh, 65W fast charging, PowerIQ 3.0, charge 3 devices simultaneously. Compact and airline-approved.",
    image: "https://picsum.photos/seed/anker20k/600/400",
    price: 4500,
    stock: 50,
  },
  {
    name: "Mechanical Gaming Keyboard",
    category: "Accessories",
    description: "TKL layout, Cherry MX Red switches, per-key RGB, anti-ghosting, N-key rollover. For competitive gaming.",
    image: "https://picsum.photos/seed/mechkbd/600/400",
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
