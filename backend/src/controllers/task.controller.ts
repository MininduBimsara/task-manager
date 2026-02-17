// Task controller - Uses Service Repository pattern
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { TaskService } from "../services/task.service.js";

const taskService = new TaskService();

/**
 * Get all tasks for the authenticated user
 * - Only returns tasks belonging to the logged-in user
 */
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.getUserTasks(userId);

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(200).json({
      message: result.message,
      tasks: result.tasks,
    });
  } catch (error) {
    // Log error internally, don't expose stack trace to client
    console.error("Get tasks controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks" });
  }
};

/**
 * Get a single task by ID
 * - Ensures the task belongs to the logged-in user
 */
export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    if (Array.isArray(taskId)) {
      res.status(400).json({ message: "Invalid Task ID" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.getTaskById(taskId, userId);

    if (!result.success) {
      const statusCode = result.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({ message: result.message });
      return;
    }

    res.status(200).json({
      message: result.message,
      task: result.task,
    });
  } catch (error) {
    console.error("Get task by ID controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the task" });
  }
};

/**
 * Create a new task
 * - Validates input
 * - Associates task with the logged-in user
 */
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, description, status } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.createTask(
      userId,
      title,
      description,
      status,
    );

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(201).json({
      message: result.message,
      task: result.task,
    });
  } catch (error) {
    console.error("Create task controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the task" });
  }
};

/**
 * Update an existing task
 * - Validates input
 * - Ensures only the task owner can update it
 */
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    if (Array.isArray(taskId)) {
      res.status(400).json({ message: "Invalid Task ID" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.updateTask(taskId, userId, {
      title,
      description,
      status,
    });

    if (!result.success) {
      const statusCode =
        result.message.includes("not found") ||
        result.message.includes("permission")
          ? 404
          : 400;
      res.status(statusCode).json({ message: result.message });
      return;
    }

    res.status(200).json({
      message: result.message,
      task: result.task,
    });
  } catch (error) {
    console.error("Update task controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the task" });
  }
};

/**
 * Delete a task
 * - Ensures only the task owner can delete it
 */
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }

    if (Array.isArray(taskId)) {
      res.status(400).json({ message: "Invalid Task ID" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.deleteTask(taskId, userId);

    if (!result.success) {
      const statusCode =
        result.message.includes("not found") ||
        result.message.includes("permission")
          ? 404
          : 400;
      res.status(statusCode).json({ message: result.message });
      return;
    }

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error("Delete task controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the task" });
  }
};

/**
 * Get tasks by status for the authenticated user
 */
export const getTasksByStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const status = req.params.status;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    if (Array.isArray(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    // Delegate to service layer
    const result = await taskService.getTasksByStatus(userId, status);

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(200).json({
      message: result.message,
      tasks: result.tasks,
    });
  } catch (error) {
    console.error("Get tasks by status controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving tasks" });
  }
};
