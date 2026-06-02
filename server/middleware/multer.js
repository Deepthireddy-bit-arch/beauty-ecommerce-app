const multer = require("multer");

// store in memory (for cloudinary upload)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;