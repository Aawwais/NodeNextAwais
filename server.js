const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
// Routes
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // 👈 Frontend URL
    credentials: true, // 👈 Allow cookies
  })
);

connectDB();
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
