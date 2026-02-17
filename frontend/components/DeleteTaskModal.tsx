"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "../app/Redux/hooks";
import { deleteTask } from "../app/Redux/Thunks/taskThunks";
import { toast } from "react-toastify";
import type { Task } from "../app/Redux/Slicers/taskSlice";

interface DeleteTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteTask(task._id));

      if (deleteTask.fulfilled.match(result)) {
        toast.success("Task deleted successfully!");
        onClose();
      } else {
        toast.error((result.payload as string) || "Failed to delete task.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
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
          maxWidth: "440px",
          margin: "0 16px",
          padding: "36px 32px",
          background:
            "linear-gradient(145deg, rgba(30,30,60,0.95), rgba(15,15,35,0.98))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          textAlign: "center",
          animation: "modalSlideIn 0.25s ease-out",
        }}
      >
        {/* Warning Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(239,68,68,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 12px 0",
            lineHeight: 1.3,
          }}
        >
          Delete Task
        </h2>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            margin: "0 0 8px 0",
          }}
        >
          Are you sure you want to delete this task?
        </p>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#e2e8f0",
            fontWeight: 600,
            margin: "0 0 8px 0",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          &ldquo;{task.title}&rdquo;
        </p>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#64748b",
            margin: "0 0 28px 0",
          }}
        >
          This action cannot be undone.
        </p>

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
            type="button"
            onClick={handleDelete}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
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
            Delete
          </button>
        </div>
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

export default DeleteTaskModal;
