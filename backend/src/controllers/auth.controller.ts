// Authentication controller - Uses Service Repository pattern
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

/**
 * Register a new user
 * - Input validated by Joi middleware before reaching this handler
 * - Delegates to AuthService
 * - Returns appropriate HTTP response
 */
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Delegate to service layer
    const result = await authService.register({ email, password });

    if (!result.success) {
      const statusCode = result.message === "User already exists" ? 409 : 400;
      res.status(statusCode).json({ message: result.message });
      return;
    }

    res.status(201).json({
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    // Log error internally, don't expose stack trace to client
    console.error("Registration controller error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

/**
 * Login a user
 * - Input validated by Joi middleware before reaching this handler
 * - Delegates to AuthService
 * - Sets JWT access token in HttpOnly cookie
 * - Sets refresh token in a separate HttpOnly cookie
 * - Returns appropriate HTTP response
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Delegate to service layer
    const result = await authService.login({ email, password });

    if (!result.success) {
      res.status(401).json({ message: result.message });
      return;
    }

    // Set JWT access token in HttpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict", // "none" needed for cross-origin Vercel deployment
      maxAge: 15 * 60 * 1000, // 15 minutes (matches JWT expiry)
    });

    // Set refresh token in a separate HttpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/auth/refresh", // Only sent to the refresh endpoint
    });

    res.status(200).json({
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    // Log error internally, don't expose stack trace to client
    console.error("Login controller error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

/**
 * Refresh access token
 * - Reads refresh token from HttpOnly cookie
 * - Issues new access token and rotates refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    // Delegate to service layer
    const result = await authService.refresh(token);

    if (!result.success) {
      res.status(401).json({ message: result.message });
      return;
    }

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 15 * 60 * 1000,
    });

    // Set new refresh token cookie (rotation)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });

    res.status(200).json({
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Refresh token controller error:", error);
    res.status(500).json({ message: "An error occurred during token refresh" });
  }
};

/**
 * Logout a user
 * - Clears the JWT token and refresh token cookies
 * - Invalidates refresh token in database
 */
export const logoutUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    // Invalidate refresh token in database if user is authenticated
    if (req.userId) {
      await authService.logout(req.userId);
    }

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/auth/refresh",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout controller error:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};
