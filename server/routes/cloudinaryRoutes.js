const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const { uploadImage } = require("../controllers/cloudinaryController");

// REMOVE test route (important)
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;