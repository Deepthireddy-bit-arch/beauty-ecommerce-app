const express = require("express");
const router = express.Router();

const {
  createCollection,
  getCollections,
  deleteCollection,
} = require("../controllers/collectionController");

router.post("/", createCollection);
router.get("/", getCollections);
router.delete("/:id", deleteCollection);

module.exports = router;