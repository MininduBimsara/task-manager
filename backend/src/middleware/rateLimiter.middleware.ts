// Rate limiting middleware using express-rate-limit
import rateLimit from "express-rate-limit";

/**
 * Global rate limiter
 * - 100 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication endpoints
 * - 10 attempts per 15 minutes per IP (prevents brute-force attacks)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
