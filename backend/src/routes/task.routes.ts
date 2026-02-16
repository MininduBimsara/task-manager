// Task routes
import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/tasks", authMiddleware, getTasks);
router.get("/tasks/status/:status", authMiddleware, getTasksByStatus);
router.get("/tasks/:id", authMiddleware, getTaskById);
router.post("/tasks", authMiddleware, createTask);
router.put("/tasks/:id", authMiddleware, updateTask);
router.delete("/tasks/:id", authMiddleware, deleteTask);

export { router as default };
