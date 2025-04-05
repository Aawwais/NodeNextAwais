const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
