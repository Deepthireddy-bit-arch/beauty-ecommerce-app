const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
} = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/", protect, updateCartQuantity);

router.delete("/:productId", protect, removeCartItem);

module.exports = router;