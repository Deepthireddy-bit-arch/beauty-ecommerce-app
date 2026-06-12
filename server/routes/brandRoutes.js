const express = require("express");
const router  = express.Router();
const {
  createBrand,
  getBrands,
  getBrandsWithCount,
  updateBrand,
  deleteBrand,
  getBrandById,
} = require("../controllers/brandController");

router.get("/",            getBrands);
router.get("/with-count",  getBrandsWithCount);
router.post("/",           createBrand);
router.get("/:id", getBrandById);
router.put("/:id",         updateBrand);
router.delete("/:id",      deleteBrand);

module.exports = router;