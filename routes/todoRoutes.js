// routes/todoRoutes.js
const express = require("express");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  searchTodos,
  getPaginatedTodos,
} = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../uploads/upload");
const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createTodo);
router.get("/", authMiddleware, getTodos);
router.put("/:id", authMiddleware, upload.single("image"), updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);
router.get("/search", authMiddleware, searchTodos);
router.get("/pagination", authMiddleware, getPaginatedTodos);

module.exports = router;
