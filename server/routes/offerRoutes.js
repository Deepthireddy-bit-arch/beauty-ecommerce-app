const express = require("express");
const router = express.Router();

const {
  createOffer,
  getActiveOffer,
  updateOffer,
  deleteOffer
} = require("../controllers/offerController");

router.post("/", createOffer);

router.get("/active", getActiveOffer);

router.put("/:id", updateOffer);

router.delete("/:id", deleteOffer);

module.exports = router;