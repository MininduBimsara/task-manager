// Task controller
import Task from "../models/task.model";

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ userId: req.userId, title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Update a task
export const updateTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).send("Task not found");

    task.title = title || task.title;
    task.description = description || task.description;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) return res.status(404).send("Task not found");
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Server error");
  }
};
