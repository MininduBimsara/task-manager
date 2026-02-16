// Task Repository - Handles all database interactions with the Task model
import Task from "../models/task.model.js";
import type { Document, Types } from "mongoose";

export interface ITask extends Document {
  userId?: Types.ObjectId | null;
  title: string;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: string;
}

export class TaskRepository {
  /**
   * Create a new task
   */
  async create(taskData: CreateTaskDTO): Promise<ITask> {
    const task = new Task({
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      updatedAt: new Date(),
    });
    return await task.save();
  }

  /**
   * Find all tasks for a specific user
   */
  async findByUserId(userId: string): Promise<ITask[]> {
    return await Task.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Find a task by ID
   */
  async findById(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }

  /**
   * Find a task by ID and user ID (ensures ownership)
   */
  async findByIdAndUserId(
    taskId: string,
    userId: string,
  ): Promise<ITask | null> {
    return await Task.findOne({ _id: taskId, userId });
  }

  /**
   * Update a task
   */
  async update(
    taskId: string,
    userId: string,
    updateData: UpdateTaskDTO,
  ): Promise<ITask | null> {
    return await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );
  }

  /**
   * Delete a task
   */
  async delete(taskId: string, userId: string): Promise<ITask | null> {
    return await Task.findOneAndDelete({ _id: taskId, userId });
  }

  /**
   * Count tasks for a user
   */
  async countByUserId(userId: string): Promise<number> {
    return await Task.countDocuments({ userId });
  }

  /**
   * Find tasks by status for a user
   */
  async findByUserIdAndStatus(
    userId: string,
    status: string,
  ): Promise<ITask[]> {
    return await Task.find({ userId, status }).sort({ createdAt: -1 });
  }

  /**
   * Delete all tasks for a user
   */
  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await Task.deleteMany({ userId });
    return result.deletedCount || 0;
  }
}
