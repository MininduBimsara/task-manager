// Task Service - Handles task business logic
import {
  TaskRepository,
  type CreateTaskDTO,
  type UpdateTaskDTO,
  type ITask,
} from "../repositories/task.repository.js";

export interface TaskResponse {
  success: boolean;
  message: string;
  task?: ITask;
  tasks?: ITask[];
}

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Get all tasks for a user
   * - Only returns tasks belonging to the authenticated user
   */
  async getUserTasks(userId: string): Promise<TaskResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const tasks = await this.taskRepository.findByUserId(userId);

      return {
        success: true,
        message: "Tasks retrieved successfully",
        tasks,
      };
    } catch (error) {
      console.error("Error getting user tasks:", error);
      return {
        success: false,
        message: "An error occurred while retrieving tasks",
      };
    }
  }

  /**
   * Get a single task by ID
   * - Ensures the task belongs to the authenticated user
   */
  async getTaskById(taskId: string, userId: string): Promise<TaskResponse> {
    try {
      if (!taskId || !userId) {
        return {
          success: false,
          message: "Task ID and User ID are required",
        };
      }

      const task = await this.taskRepository.findByIdAndUserId(taskId, userId);

      if (!task) {
        return {
          success: false,
          message: "Task not found or you do not have permission to access it",
        };
      }

      return {
        success: true,
        message: "Task retrieved successfully",
        task,
      };
    } catch (error) {
      console.error("Error getting task by ID:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the task",
      };
    }
  }

  /**
   * Create a new task
   * - Validates input data
   * - Associates the task with the authenticated user
   */
  async createTask(
    userId: string,
    title: string,
    description?: string,
    status?: string,
  ): Promise<TaskResponse> {
    try {
      // Validate required fields
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      if (!title || title.trim().length === 0) {
        return {
          success: false,
          message: "Title is required",
        };
      }

      // Validate title length
      if (title.length > 200) {
        return {
          success: false,
          message: "Title must be less than 200 characters",
        };
      }

      // Validate description length if provided
      if (description && description.length > 1000) {
        return {
          success: false,
          message: "Description must be less than 1000 characters",
        };
      }

      // Validate status if provided
      const validStatuses = ["pending", "in-progress", "completed"];
      if (status && !validStatuses.includes(status)) {
        return {
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        };
      }

      // Create the task
      const taskData: CreateTaskDTO = {
        userId,
        title: title.trim(),
        status: status || "pending",
      };

      if (description !== undefined) {
        taskData.description = description.trim();
      }

      const task = await this.taskRepository.create(taskData);

      return {
        success: true,
        message: "Task created successfully",
        task,
      };
    } catch (error) {
      console.error("Error creating task:", error);
      return {
        success: false,
        message: "An error occurred while creating the task",
      };
    }
  }

  /**
   * Update an existing task
   * - Validates input data
   * - Ensures the task belongs to the authenticated user
   */
  async updateTask(
    taskId: string,
    userId: string,
    updateData: { title?: string; description?: string; status?: string },
  ): Promise<TaskResponse> {
    try {
      if (!taskId || !userId) {
        return {
          success: false,
          message: "Task ID and User ID are required",
        };
      }

      // Check if task exists and belongs to user
      const existingTask = await this.taskRepository.findByIdAndUserId(
        taskId,
        userId,
      );
      if (!existingTask) {
        return {
          success: false,
          message: "Task not found or you do not have permission to modify it",
        };
      }

      // Validate title if provided
      if (updateData.title !== undefined) {
        if (updateData.title.trim().length === 0) {
          return {
            success: false,
            message: "Title cannot be empty",
          };
        }
        if (updateData.title.length > 200) {
          return {
            success: false,
            message: "Title must be less than 200 characters",
          };
        }
        updateData.title = updateData.title.trim();
      }

      // Validate description if provided
      if (
        updateData.description !== undefined &&
        updateData.description.length > 1000
      ) {
        return {
          success: false,
          message: "Description must be less than 1000 characters",
        };
      }

      // Validate status if provided
      const validStatuses = ["pending", "in-progress", "completed"];
      if (updateData.status && !validStatuses.includes(updateData.status)) {
        return {
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        };
      }

      // Prepare update data
      const dataToUpdate: UpdateTaskDTO = {};
      if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
      if (updateData.description !== undefined)
        dataToUpdate.description = updateData.description.trim();
      if (updateData.status !== undefined)
        dataToUpdate.status = updateData.status;

      // Update the task
      const updatedTask = await this.taskRepository.update(
        taskId,
        userId,
        dataToUpdate,
      );

      if (!updatedTask) {
        return {
          success: false,
          message: "Failed to update task",
        };
      }

      return {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        success: false,
        message: "An error occurred while updating the task",
      };
    }
  }

  /**
   * Delete a task
   * - Ensures the task belongs to the authenticated user
   */
  async deleteTask(taskId: string, userId: string): Promise<TaskResponse> {
    try {
      if (!taskId || !userId) {
        return {
          success: false,
          message: "Task ID and User ID are required",
        };
      }

      // Delete the task (only if it belongs to the user)
      const deletedTask = await this.taskRepository.delete(taskId, userId);

      if (!deletedTask) {
        return {
          success: false,
          message: "Task not found or you do not have permission to delete it",
        };
      }

      return {
        success: true,
        message: "Task deleted successfully",
        task: deletedTask,
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        message: "An error occurred while deleting the task",
      };
    }
  }

  /**
   * Get tasks by status for a user
   */
  async getTasksByStatus(
    userId: string,
    status: string,
  ): Promise<TaskResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const validStatuses = ["pending", "in-progress", "completed"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        };
      }

      const tasks = await this.taskRepository.findByUserIdAndStatus(
        userId,
        status,
      );

      return {
        success: true,
        message: "Tasks retrieved successfully",
        tasks,
      };
    } catch (error) {
      console.error("Error getting tasks by status:", error);
      return {
        success: false,
        message: "An error occurred while retrieving tasks",
      };
    }
  }
}
