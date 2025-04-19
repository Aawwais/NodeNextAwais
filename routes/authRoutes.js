const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../uploads/upload");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile
);

module.exports = router;
