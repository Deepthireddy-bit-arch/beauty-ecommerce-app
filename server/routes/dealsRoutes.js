const express = require("express");
const router = express.Router();

const { getDeals } = require("../controllers/dealsController");

router.get("/deals", getDeals);

module.exports = router;