import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTasks,
  fetchTaskById,
  fetchTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
} from "../Thunks/taskThunks";

// ── Types ──────────────────────────────────────────────
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

// ── Initial State ──────────────────────────────────────
const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

// ── Slice ──────────────────────────────────────────────
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
    clearSelectedTask(state) {
      state.selectedTask = null;
    },
    resetTasks() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch All Tasks ──────────────────────────────
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<{ tasks: Task[]; message: string }>) => {
          state.loading = false;
          state.tasks = action.payload.tasks;
        },
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Fetch Task By ID ─────────────────────────────
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<{ task: Task; message: string }>) => {
          state.loading = false;
          state.selectedTask = action.payload.task;
        },
      )
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Fetch Tasks By Status ────────────────────────
    builder
      .addCase(fetchTasksByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasksByStatus.fulfilled,
        (state, action: PayloadAction<{ tasks: Task[]; message: string }>) => {
          state.loading = false;
          state.tasks = action.payload.tasks;
        },
      )
      .addCase(fetchTasksByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Create Task ──────────────────────────────────
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createTask.fulfilled,
        (state, action: PayloadAction<{ task: Task; message: string }>) => {
          state.loading = false;
          state.tasks.push(action.payload.task);
        },
      )
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Update Task ──────────────────────────────────
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<{ task: Task; message: string }>) => {
          state.loading = false;
          const index = state.tasks.findIndex(
            (t) => t._id === action.payload.task._id,
          );
          if (index !== -1) {
            state.tasks[index] = action.payload.task;
          }
          if (state.selectedTask?._id === action.payload.task._id) {
            state.selectedTask = action.payload.task;
          }
        },
      )
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Delete Task ──────────────────────────────────
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<{ taskId: string; message: string }>) => {
          state.loading = false;
          state.tasks = state.tasks.filter(
            (t) => t._id !== action.payload.taskId,
          );
          if (state.selectedTask?._id === action.payload.taskId) {
            state.selectedTask = null;
          }
        },
      )
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError, clearSelectedTask, resetTasks } =
  taskSlice.actions;
export default taskSlice.reducer;
