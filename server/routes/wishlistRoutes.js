const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// GET wishlist
router.get("/", auth, getWishlist);

// ADD wishlist
router.post("/add", auth, addToWishlist);

// REMOVE wishlist
router.delete("/:productId", auth, removeFromWishlist);

module.exports = router;