const express = require("express");
const { getCategoryBanners, createCategoryBanner, deleteCategoryBanner } = require("../controllers/categotybannerController");
const router = express.Router();



router.get("/", getCategoryBanners);
router.post("/", createCategoryBanner);
router.delete("/:id", deleteCategoryBanner);

module.exports = router;