// Authentication routes
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

// Auth rate limiter applied to all auth routes (10 req / 15 min per IP)
router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.post("/refresh", authLimiter, refreshToken);
router.post("/logout", authMiddleware, logoutUser);

export { router as default };
