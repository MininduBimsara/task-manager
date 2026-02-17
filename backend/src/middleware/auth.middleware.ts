// Authentication middleware - Verifies JWT from HttpOnly cookie
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include userId from auth middleware
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Middleware to verify JWT token from HttpOnly cookies.
 * Attaches userId to req if token is valid.
 * Returns 401 Unauthorized if token is missing or invalid.
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
