const jwt = require("jsonwebtoken"); //Security guard of your backend”
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from "Bearer token"
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // allow access
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;