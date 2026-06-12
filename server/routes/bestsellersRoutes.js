const express = require("express");
const { getBestSellerProducts } = require("../controllers/bestSellerController");

const router = express.Router();



router.get("/", getBestSellerProducts);

module.exports = router;