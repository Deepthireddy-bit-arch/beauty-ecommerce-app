const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ✅ ADD THIS LINE (IMPORTANT FIX)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

dotenv.config();
console.log("MONGO_URI =", process.env.MONGO_URI);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/user", userRoutes);