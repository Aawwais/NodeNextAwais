const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    console.log("localFilePath", localFilePath);
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file uploaded:", response.url);
    return response;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return null;
  }
};
module.exports = {
  uploadCloudinary,
  deleteCloudinaryImage,
};
