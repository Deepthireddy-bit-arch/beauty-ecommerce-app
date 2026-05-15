const express = require("express"); //“Only logged-in users can access this”
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile data accessed successfully",
    user: req.user,
  });
});

module.exports = router;