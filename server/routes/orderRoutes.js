console.log("🔥 ORDER ROUTES FILE LOADED");
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

// create order
router.post("/", protect, createOrder);

// my orders
router.get("/myorders", protect, getMyOrders);

// single order
router.get("/:id", protect, getOrderById);

// update status (admin)
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;