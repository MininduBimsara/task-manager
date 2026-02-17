"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/Redux/Store/store";
import { loginUser } from "../app/Redux/Thunks/authThunks";
import Link from "next/link";
import Joi from "joi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = schema.validate(
      { email, password },
      { abortEarly: false },
    );

    if (error) {
      const newErrors: { email?: string; password?: string } = {};
      error.details.forEach((detail) => {
        if (detail.path[0] === "email") newErrors.email = detail.message;
        if (detail.path[0] === "password") newErrors.password = detail.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        if (resultAction.payload) {
          toast.error(resultAction.payload as string);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          top: "-80px",
          left: "15%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #f472b6, #a855f7, #ec4899)",
          filter: "blur(2px)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "15%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 40%, #334155, #1e293b, #0f172a)",
          opacity: 0.85,
        }}
      />
      {/* Small floating dots */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "8%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#a855f7",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "10%",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#f472b6",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#818cf8",
          opacity: 0.4,
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "440px",
          padding: "48px 36px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "36px",
            letterSpacing: "-0.02em",
          }}
        >
          Sign in.
        </h1>

        {/* Social Buttons - commented out for now */}
        {/*
        <button type="button" style={{ width: "100%", padding: "12px 20px", border: "1px solid #334155", borderRadius: "8px", background: "transparent", color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px", transition: "border-color 0.2s, background 0.2s" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <button type="button" style={{ width: "100%", padding: "12px 20px", border: "1px solid #334155", borderRadius: "8px", background: "transparent", color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px", transition: "border-color 0.2s, background 0.2s" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>

        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "20px" }}>or</p>
        */}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 16px",
                border: errors.email
                  ? "1px solid #ef4444"
                  : "1px solid #334155",
                borderRadius: "8px",
                background: "transparent",
                color: "#e2e8f0",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                if (!errors.email)
                  e.currentTarget.style.borderColor = "#818cf8";
              }}
              onBlur={(e) => {
                if (!errors.email)
                  e.currentTarget.style.borderColor = "#334155";
              }}
            />
            {errors.email && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                  textAlign: "left",
                }}
              >
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 16px",
                border: errors.password
                  ? "1px solid #ef4444"
                  : "1px solid #334155",
                borderRadius: "8px",
                background: "transparent",
                color: "#e2e8f0",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                if (!errors.password)
                  e.currentTarget.style.borderColor = "#818cf8";
              }}
              onBlur={(e) => {
                if (!errors.password)
                  e.currentTarget.style.borderColor = "#334155";
              }}
            />
            {errors.password && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                  textAlign: "left",
                }}
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Gradient Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ec4899, #f97316)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 4px 20px rgba(236, 72, 153, 0.3)",
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
                  width: "20px",
                  height: "20px",
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
            Sign in
          </button>
        </form>

        {/* Links */}
        <p
          style={{
            marginTop: "28px",
            color: "#94a3b8",
            fontSize: "0.9rem",
          }}
        >
          Dont have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#ffffff",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Create Account
          </Link>
        </p>
        {/* Forgot Password - removed for now */}
      </div>

      {/* Spin keyframe for loading */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
