"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/Redux/hooks";
import { fetchTasks, createTask } from "../app/Redux/Thunks/taskThunks";
import { logoutUser } from "../app/Redux/Thunks/authThunks";
import { persistor } from "../app/Redux/Store/store";
import type { Task } from "../app/Redux/Slicers/taskSlice";
import ViewTaskModal from "./ViewTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Modal state
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskItem, setDeleteTaskItem] = useState<Task | null>(null);

  // Create task state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState<
    "pending" | "in-progress" | "completed"
  >("pending");
  const [creating, setCreating] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    dispatch(fetchTasks());
  }, [dispatch, isAuthenticated, router]);

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    setCreating(true);
    try {
      const result = await dispatch(
        createTask({
          title: newTitle.trim(),
          description: newDesc.trim(),
          status: newStatus,
        }),
      );
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully!");
        setNewTitle("");
        setNewDesc("");
        setNewStatus("pending");
        setShowCreate(false);
      } else {
        toast.error((result.payload as string) || "Failed to create task.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setCreating(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      pending: {
        bg: "rgba(251,191,36,0.15)",
        text: "#fbbf24",
        label: "Pending",
      },
      "in-progress": {
        bg: "rgba(96,165,250,0.15)",
        text: "#60a5fa",
        label: "In Progress",
      },
      completed: {
        bg: "rgba(52,211,153,0.15)",
        text: "#34d399",
        label: "Completed",
      },
    };
    const s = map[status] || map.pending;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "20px",
          background: s.bg,
          color: s.text,
          fontSize: "0.75rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {s.label}
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    color: "#e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box" as const,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d1a",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Decorative Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "10%",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #f472b6, #a855f7, #ec4899)",
          filter: "blur(3px)",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "8%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 40%, #334155, #1e293b, #0f172a)",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #818cf8, #6366f1)",
          filter: "blur(4px)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="dashboard-content"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Header */}
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Tasks
            </h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "rgba(129,140,248,0.15)",
                color: "#818cf8",
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "0 8px",
              }}
            >
              {filteredTasks.length}
            </span>
          </div>

          <div
            className="dashboard-controls"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            {/* Search */}
            <div className="dashboard-search" style={{ position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "9px 14px 9px 36px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e2e8f0",
                  fontSize: "0.85rem",
                  outline: "none",
                  width: "220px",
                  transition: "border-color 0.2s",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {/* New Task Button */}
            {/* eslint-disable-next-line -- className for responsive CSS */}
            <button
              className="dashboard-btn-new"
              onClick={() => setShowCreate(!showCreate)}
              style={{
                padding: "9px 18px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #ec4899, #f97316)",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "opacity 0.2s, transform 0.15s",
                boxShadow: "0 4px 20px rgba(236,72,153,0.3)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Task
            </button>

            {/* Logout Button */}
            <button
              className="dashboard-btn-logout"
              onClick={async () => {
                await dispatch(logoutUser());
                await persistor.purge();
                router.push("/login");
              }}
              style={{
                padding: "9px 18px",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background 0.2s, border-color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Create Task Panel */}
        {showCreate && (
          <div
            style={{
              marginBottom: "28px",
              padding: "24px",
              background:
                "linear-gradient(145deg, rgba(30,30,60,0.9), rgba(15,15,35,0.95))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              animation: "modalSlideIn 0.2s ease-out",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#818cf8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              Create New Task
            </p>
            <form onSubmit={handleCreateTask}>
              <div
                className="create-task-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label style={labelStyle}>Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#818cf8";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(
                        e.target.value as
                          | "pending"
                          | "in-progress"
                          | "completed",
                      )
                    }
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "40px",
                    }}
                  >
                    <option value="pending" style={{ background: "#1e1e3c" }}>
                      Pending
                    </option>
                    <option
                      value="in-progress"
                      style={{ background: "#1e1e3c" }}
                    >
                      In Progress
                    </option>
                    <option value="completed" style={{ background: "#1e1e3c" }}>
                      Completed
                    </option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Task description (optional)"
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#818cf8";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={{
                    padding: "9px 20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#e2e8f0",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: "9px 24px",
                    border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #818cf8, #6366f1)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: creating ? "not-allowed" : "pointer",
                    opacity: creating ? 0.7 : 1,
                    transition: "opacity 0.2s",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    if (!creating) e.currentTarget.style.opacity = "1";
                  }}
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              padding: "14px 20px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* Task Table */}
        <div
          className="task-table-wrapper"
          style={{
            background:
              "linear-gradient(145deg, rgba(30,30,60,0.7), rgba(15,15,35,0.8))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            className="task-table-header"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 140px",
              padding: "14px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {["Task Title", "Status", "Created", "Updated", "Actions"].map(
              (col) => (
                <span
                  key={col}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {col}
                </span>
              ),
            )}
          </div>

          {/* Loading State */}
          {loading && tasks.length === 0 && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <svg
                style={{
                  animation: "spin 1s linear infinite",
                  width: "32px",
                  height: "32px",
                  color: "#818cf8",
                  margin: "0 auto 12px",
                  display: "block",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                Loading tasks...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredTasks.length === 0 && (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(129,140,248,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p
                style={{
                  color: "#e2e8f0",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                {search ? "No matching tasks" : "No tasks yet"}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                {search
                  ? "Try a different search term."
                  : "Create your first task to get started."}
              </p>
            </div>
          )}

          {/* Task Rows */}
          {filteredTasks.map((task, index) => (
            <div
              key={task._id}
              className="task-table-row"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 140px",
                padding: "16px 24px",
                borderBottom:
                  index < filteredTasks.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
                alignItems: "center",
                transition: "background 0.15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Title */}
              <div>
                <p
                  style={{
                    color: "#e2e8f0",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingRight: "16px",
                  }}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      margin: "2px 0 0 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      paddingRight: "16px",
                    }}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              {/* Status */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  className="task-cell-label"
                  style={{
                    display: "none",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  Status:
                </span>
                {statusBadge(task.status)}
              </div>

              {/* Created */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  className="task-cell-label"
                  style={{
                    display: "none",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  Created:
                </span>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                    margin: 0,
                  }}
                >
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Updated */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  className="task-cell-label"
                  style={{
                    display: "none",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  Updated:
                </span>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                    margin: 0,
                  }}
                >
                  {new Date(task.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Actions */}
              <div
                className="task-actions"
                style={{ display: "flex", gap: "6px" }}
              >
                {/* View */}
                <button
                  onClick={() => setViewTask(task)}
                  title="View"
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "none",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(129,140,248,0.15)";
                    e.currentTarget.style.color = "#818cf8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                {/* Edit */}
                <button
                  onClick={() => setEditTask(task)}
                  title="Edit"
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "none",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(251,191,36,0.15)";
                    e.currentTarget.style.color = "#fbbf24";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteTaskItem(task)}
                  title="Delete"
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "none",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {viewTask && (
        <ViewTaskModal
          task={viewTask}
          isOpen={!!viewTask}
          onClose={() => setViewTask(null)}
        />
      )}
      {editTask && (
        <UpdateTaskModal
          key={editTask._id}
          task={editTask}
          isOpen={!!editTask}
          onClose={() => setEditTask(null)}
        />
      )}
      {deleteTaskItem && (
        <DeleteTaskModal
          task={deleteTaskItem}
          isOpen={!!deleteTaskItem}
          onClose={() => setDeleteTaskItem(null)}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
