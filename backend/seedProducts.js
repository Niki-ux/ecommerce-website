import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config({ path: "./backend/.env" });

const products = [
  {
    title: "Wireless Over-Ear Headphones",
    price: 2499,
    category: "Electronics",
    description:
      "Comfortable over-ear headphones with deep bass, active noise cancellation, and up to 40 hours of battery life.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.5,
    reviewsCount: 128,
    inStock: true,
  },
  {
    title: "Classic Minimalist Watch",
    price: 3499,
    category: "Accessories",
    description:
      "Elegant wrist watch with genuine Italian leather strap, quartz movement, and water-resistant casing.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.8,
    reviewsCount: 94,
    inStock: true,
  },
  {
    title: "Sport Running Shoes",
    price: 1999,
    category: "Footwear",
    description:
      "Lightweight and breathable running sneakers engineered for high shock absorption and daily road training.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.2,
    reviewsCount: 63,
    inStock: true,
  },
  {
    title: "Mechanical Gaming Keyboard",
    price: 2299,
    category: "Electronics",
    description:
      "Compact mechanical keyboard featuring tactile switches, dynamic RGB backlighting, and hot-swappable keys.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.6,
    reviewsCount: 210,
    inStock: true,
  },
  {
    title: "Heavyweight Cotton Hoodie",
    price: 1499,
    category: "Apparel",
    description:
      "Premium fleece-lined pullover hoodie made from 100% combed organic cotton for everyday warmth.",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.4,
    reviewsCount: 45,
    inStock: true,
  },
  {
    title: "Polarized Clubmaster Sunglasses",
    price: 1299,
    category: "Accessories",
    description:
      "Retro wire-rim sunglasses with UV400 polarized scratch-resistant lenses and reinforced hinges.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.7,
    reviewsCount: 82,
    inStock: true,
  },
  {
    title: "Waterproof Trail Hiking Boots",
    price: 3999,
    category: "Footwear",
    description:
      "All-terrain waterproof leather boots with deep lug rubber outsoles for ankle support and traction.",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.9,
    reviewsCount: 115,
    inStock: true,
  },
  {
    title: "Fast-Charging Magnetic Power Bank",
    price: 1199,
    category: "Electronics",
    description:
      "10,000mAh slim portable charger with MagSafe compatibility and fast USB-C power delivery.",
    image:
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.3,
    reviewsCount: 77,
    inStock: true,
  },
  {
    title: "Casual Relaxed Fit Denim Jacket",
    price: 2199,
    category: "Apparel",
    description:
      "Vintage stonewashed blue denim jacket with durable metal buttons and dual chest flap pockets.",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.5,
    reviewsCount: 52,
    inStock: true,
  },
  {
    title: "RFID-Blocking Slim Leather Wallet",
    price: 799,
    category: "Accessories",
    description:
      "Handcrafted bifold cardholder made from full-grain leather with built-in signal protection.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.6,
    reviewsCount: 140,
    inStock: true,
  },
  {
    title: "Canvas Slip-On Skate Shoes",
    price: 1299,
    category: "Footwear",
    description:
      "Durable low-profile canvas shoes with vulcanized waffle grip soles and elastic side accents.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.1,
    reviewsCount: 38,
    inStock: true,
  },
  {
    title: "Oversized Graphic Streetwear Tee",
    price: 699,
    category: "Apparel",
    description:
      "Drop-shoulder unisex streetwear t-shirt crafted from 240 GSM pre-shrunk carded cotton.",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.7,
    reviewsCount: 66,
    inStock: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("12 complete ZOVA products inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();