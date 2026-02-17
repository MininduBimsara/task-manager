"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/Redux/hooks";
import { updateTask } from "../app/Redux/Thunks/taskThunks";
import { toast } from "react-toastify";
import type { Task } from "../app/Redux/Slicers/taskSlice";

interface UpdateTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    task.status,
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    try {
      const result = await dispatch(
        updateTask({
          taskId: task._id,
          data: {
            title: title.trim(),
            description: description.trim(),
            status,
          },
        }),
      );

      if (updateTask.fulfilled.match(result)) {
        toast.success("Task updated successfully!");
        onClose();
      } else {
        toast.error((result.payload as string) || "Failed to update task.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
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
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          margin: "0 16px",
          padding: "36px 32px",
          background:
            "linear-gradient(145deg, rgba(30,30,60,0.95), rgba(15,15,35,0.98))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          animation: "modalSlideIn 0.25s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.06)",
            color: "#94a3b8",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          ✕
        </button>

        {/* Header */}
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          Edit Task
        </p>
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 28px 0",
            lineHeight: 1.3,
          }}
        >
          Update Task Details
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Task title"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#818cf8";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "80px",
              }}
              placeholder="Task description (optional)"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#818cf8";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "pending" | "in-progress" | "completed",
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
              <option value="in-progress" style={{ background: "#1e1e3c" }}>
                In Progress
              </option>
              <option value="completed" style={{ background: "#1e1e3c" }}>
                Completed
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px 20px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                fontSize: "0.9rem",
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
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s, transform 0.15s",
                boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.opacity = "1";
              }}
            >
              {loading && (
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    width: "18px",
                    height: "18px",
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
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateTaskModal;
