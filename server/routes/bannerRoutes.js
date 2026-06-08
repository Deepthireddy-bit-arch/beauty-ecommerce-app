const express = require("express");
const router  = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.get("/",      getBanners);
router.post("/",     createBanner);
router.put("/:id",   updateBanner);
router.delete("/:id",deleteBanner);

module.exports = router;