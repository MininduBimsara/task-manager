// Custom MongoDB sanitization middleware (Express 5 compatible)
// Replaces express-mongo-sanitize which is incompatible with Express 5
// (Express 5 makes req.query a read-only getter)
import type { Request, Response, NextFunction } from "express";

/**
 * Recursively removes keys starting with '$' or containing '.'
 * from an object to prevent NoSQL injection attacks.
 * Mutates the object in-place (required for Express 5 compatibility).
 */
function sanitizeObject(obj: unknown): void {
  if (obj === null || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      sanitizeObject(item);
    }
    return;
  }

  for (const key of Object.keys(obj as Record<string, unknown>)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete (obj as Record<string, unknown>)[key];
    } else {
      sanitizeObject((obj as Record<string, unknown>)[key]);
    }
  }
}

/**
 * Express 5 compatible middleware that sanitizes req.body, req.params,
 * and req.query to prevent NoSQL injection attacks.
 *
 * Unlike express-mongo-sanitize, this mutates objects in-place instead
 * of reassigning req.query (which is read-only in Express 5).
 */
export const mongoSanitize = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) sanitizeObject(req.query);
  next();
};
