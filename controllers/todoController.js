const {
  uploadCloudinary,
  deleteCloudinaryImage,
} = require("../middleware/cloudinary");
const Todo = require("../models/Todo");
const fs = require("fs");

// Create
exports.createTodo = async (req, res) => {
  const { title } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    console.log("image", image);
    let imageUrl;
    if (image) {
      imageUrl = await uploadCloudinary(image);
      console.log("image2", imageUrl);
      if (imageUrl) {
        fs.unlinkSync(image);
      }
    }
    const newTodo = new Todo({
      title,
      image: imageUrl.url,
      cloudinaryId: imageUrl.public_id,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Error creating todo", error: err });
  }
};

// Get All
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err });
  }
};

// Update
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const existingTodo = await Todo.findById(id);

    if (image && existingTodo.image) {
      await deleteCloudinaryImage(existingTodo.cloudinaryId);
    }

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await uploadCloudinary(image);
      if (cloudinaryResponse) {
        fs.unlinkSync(image);
      }
    }

    const updatedFields = { title, completed };
    if (cloudinaryResponse) {
      updatedFields.image = cloudinaryResponse.url;
      updatedFields.cloudinaryId = cloudinaryResponse.public_id;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating todo", error: err });
  }
};

// Delete
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (todo?.cloudinaryId) {
      await deleteCloudinaryImage(todo.cloudinaryId);
    }

    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
};
