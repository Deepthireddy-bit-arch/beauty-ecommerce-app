const express = require("express");//API endpoints for regreistation and logic
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;