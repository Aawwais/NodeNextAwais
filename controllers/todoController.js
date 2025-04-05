// controllers/todoController.js
const Todo = require("../models/Todo");

// Create a new todo
exports.createTodo = async (req, res) => {
  const { title } = req.body;

  try {
    const newTodo = new Todo({
      title,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Error creating todo", error: err });
  }
};

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
};
