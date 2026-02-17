// Auth validation schemas using Joi
import Joi from "joi";

/**
 * Schema for user registration
 * - Email must be a valid email format
 * - Password must be at least 8 characters with at least one uppercase, one lowercase, one number
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 128 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is required",
    }),
});

/**
 * Schema for user login
 * - Email and password are required, basic format check
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

/**
 * Schema for token refresh
 */
export const refreshSchema = Joi.object({
  refreshToken: Joi.string().optional(),
});
