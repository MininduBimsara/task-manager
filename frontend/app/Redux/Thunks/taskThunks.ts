import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Task } from "../Slicers/taskSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────
interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed";
}

interface UpdateTaskPayload {
  taskId: string;
  data: {
    title?: string;
    description?: string;
    status?: "pending" | "in-progress" | "completed";
  };
}

// ── Fetch All Tasks ────────────────────────────────────
export const fetchTasks = createAsyncThunk<
  { tasks: Task[]; message: string },
  void,
  { rejectValue: string }
>("tasks/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ tasks: Task[]; message: string }>(
      `${API_BASE_URL}/api/tasks`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch tasks",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Fetch Task By ID ───────────────────────────────────
export const fetchTaskById = createAsyncThunk<
  { task: Task; message: string },
  string,
  { rejectValue: string }
>("tasks/fetchById", async (taskId, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ task: Task; message: string }>(
      `${API_BASE_URL}/api/tasks/${taskId}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch task",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Fetch Tasks By Status ──────────────────────────────
export const fetchTasksByStatus = createAsyncThunk<
  { tasks: Task[]; message: string },
  string,
  { rejectValue: string }
>("tasks/fetchByStatus", async (status, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ tasks: Task[]; message: string }>(
      `${API_BASE_URL}/api/tasks/status/${status}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch tasks by status",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Create Task ────────────────────────────────────────
export const createTask = createAsyncThunk<
  { task: Task; message: string },
  CreateTaskPayload,
  { rejectValue: string }
>("tasks/create", async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ task: Task; message: string }>(
      `${API_BASE_URL}/api/tasks`,
      taskData,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to create task",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Update Task ────────────────────────────────────────
export const updateTask = createAsyncThunk<
  { task: Task; message: string },
  UpdateTaskPayload,
  { rejectValue: string }
>("tasks/update", async ({ taskId, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put<{ task: Task; message: string }>(
      `${API_BASE_URL}/api/tasks/${taskId}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to update task",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Delete Task ────────────────────────────────────────
export const deleteTask = createAsyncThunk<
  { taskId: string; message: string },
  string,
  { rejectValue: string }
>("tasks/delete", async (taskId, { rejectWithValue }) => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_BASE_URL}/api/tasks/${taskId}`,
      { withCredentials: true },
    );
    return { taskId, message: response.data.message };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete task",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
