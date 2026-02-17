"use client";

import React from "react";
import type { Task } from "../app/Redux/Slicers/taskSlice";

interface ViewTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const statusColor: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    "in-progress": { bg: "rgba(96,165,250,0.15)", text: "#60a5fa" },
    completed: { bg: "rgba(52,211,153,0.15)", text: "#34d399" },
  };

  const colors = statusColor[task.status] || statusColor.pending;

  const statusLabel =
    task.status === "in-progress"
      ? "In Progress"
      : task.status.charAt(0).toUpperCase() + task.status.slice(1);

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
        className="modal-body"
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
        <div style={{ marginBottom: "8px" }}>
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
            Task Details
          </p>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.3,
              paddingRight: "32px",
            }}
          >
            {task.title}
          </h2>
        </div>

        {/* Status Badge */}
        <div style={{ margin: "16px 0 24px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: "20px",
              background: colors.bg,
              color: colors.text,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            Description
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#cbd5e1",
              lineHeight: 1.7,
              margin: 0,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
              minHeight: "60px",
            }}
          >
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Timestamps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Created At
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#e2e8f0",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {new Date(task.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Updated At
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#e2e8f0",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {new Date(task.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {new Date(task.updatedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
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
          Close
        </button>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ViewTaskModal;
