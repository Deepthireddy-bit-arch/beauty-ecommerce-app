const express = require("express");
const router = express.Router();

const {
  createCollection,
  getCollections,
  deleteCollection,
  getCollectionById,
} = require("../controllers/collectionController");

router.post("/", createCollection);
router.get("/", getCollections);
router.get("/:id",getCollectionById);
router.delete("/:id", deleteCollection);

module.exports = router;