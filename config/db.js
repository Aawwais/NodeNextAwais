const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    mongoose.connection.on("error", function (error) {
      console.error("Database connection error:", error);
    });

    console.log("MongoDB Connected.");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
