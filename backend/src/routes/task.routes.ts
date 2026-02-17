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
import { validate } from "../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

const router = express.Router();

router.get("/tasks", authMiddleware, getTasks);
router.get("/tasks/status/:status", authMiddleware, getTasksByStatus);
router.get("/tasks/:id", authMiddleware, getTaskById);
router.post("/tasks", authMiddleware, validate(createTaskSchema), createTask);
router.put(
  "/tasks/:id",
  authMiddleware,
  validate(updateTaskSchema),
  updateTask,
);
router.delete("/tasks/:id", authMiddleware, deleteTask);

export { router as default };
