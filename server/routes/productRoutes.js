const express = require("express");

const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  activateAllProducts,
} = require("../controllers/productController");

const router = express.Router();


// ADD PRODUCT
router.post("/", addProduct);

router.put("/activate-all",  activateAllProducts);
// GET ALL PRODUCTS
router.get("/", getProducts);


// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);


// UPDATE PRODUCT
router.put("/:id", updateProduct);


// DELETE PRODUCT
router.delete("/:id", deleteProduct);


module.exports = router;