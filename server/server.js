const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use("*", (req, res, next) => {
  console.log("⚡ VERY FIRST MIDDLEWARE HIT:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const brandRoutes = require("./routes/brandRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const homeRoutes = require("./routes/homeRoutes");
const dealsRoutes = require("./routes/dealsRoutes");
const categoryBannerRoutes = require("./routes/categorybannerroutes");
const collectionRoutes = require("./routes/collectionRoutes");
const bannerRoutes  = require("./routes/bannerRoutes");
const searchRoutes = require("./routes/searchRoutes");
const offerRoutes = require("./routes/offerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const newArrivalRoutes = require('./routes/newArrivalRoutes');
const bestSellerRoutes=require('./routes/bestsellersRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api", homeRoutes);
app.use("/api", dealsRoutes);
app.use("/api/category-banners", categoryBannerRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/banners",  bannerRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api", categoryRoutes);
app.use('/api/newarrivals', newArrivalRoutes);
app.use('/api/bestSellers', bestSellerRoutes);


app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;