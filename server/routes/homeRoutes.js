const express = require("express");
const router = express.Router();

const { getHomeData, createInsiderBuzz, deleteInsiderBuzz } = require("../controllers/homeController");

router.get("/home", getHomeData); 
router.post("/buzz", createInsiderBuzz);
router.delete("/buzz/:id", deleteInsiderBuzz);

module.exports = router;