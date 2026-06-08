const express = require("express");
const router  = express.Router();
const {
  createBrand,
  getBrands,
  getBrandsWithCount,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router.get("/",            getBrands);
router.get("/with-count",  getBrandsWithCount);
router.post("/",           createBrand);
router.put("/:id",         updateBrand);
router.delete("/:id",      deleteBrand);

module.exports = router;