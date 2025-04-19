const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  uploadCloudinary,
  deleteCloudinaryImage,
} = require("../middleware/cloudinary");
const fs = require("fs");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3600h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("req", req.body, req.file);
  const { phoneNumber } = req.body;
  const userId = req.user.id;
  const image = req.file ? req.file.path : null;
  try {
    const updateData = {
      phoneNumber,
    };
    const existingUser = await User.findById(userId);
    if (image && existingUser.cloudinaryId) {
      await deleteCloudinaryImage(existingUser.cloudinaryId);
    }
    let imageUrl;
    if (image) {
      imageUrl = await uploadCloudinary(image);
      if (imageUrl) {
        fs.unlinkSync(image);
      }
      updateData.profilePicture = imageUrl.url;
      updateData.cloudinaryId = imageUrl.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: err });
  }
};
