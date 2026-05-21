const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

connectDB();

const app = express();
app.use("*", (req, res, next) => {
  console.log("⚡ VERY FIRST MIDDLEWARE HIT:", req.method, req.url);
  next();
});
// middleware
app.use(cors());
app.use(express.json());



// routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes= require("./routes/cartRoutes");
const wishlistRoutes= require("./routes/wishlistRoutes");
const orderRoutes =require("./routes/orderRoutes");
const paymentRoutes =require("./routes/paymentRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
console.log("orderRoutes type:", typeof orderRoutes);
console.log("orderRoutes:", orderRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/payments", paymentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});