const express = require("express");
const router = express.Router();

const multer = require("../middleware/multer");

const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

// CREATE BRAND
router.post(
  "/create",
  multer.single("logo"),
  createBrand
);

// GET ALL BRANDS
router.get("/", getBrands);

// UPDATE BRAND
router.put("/:id", updateBrand);

// DELETE BRAND
router.delete("/:id", deleteBrand);

module.exports = router;