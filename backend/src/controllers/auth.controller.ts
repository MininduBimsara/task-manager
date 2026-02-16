// Authentication controller - Uses Service Repository pattern
import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

/**
 * Register a new user
 * - Validates input
 * - Delegates to AuthService
 * - Returns appropriate HTTP response
 */
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

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
 * - Validates input
 * - Delegates to AuthService
 * - Sets JWT token in HttpOnly cookie
 * - Returns appropriate HTTP response
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Delegate to service layer
    const result = await authService.login({ email, password });

    if (!result.success) {
      res.status(401).json({ message: result.message });
      return;
    }

    // Set JWT token in HttpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
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
 * Logout a user
 * - Clears the JWT token cookie
 */
export const logoutUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout controller error:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};
