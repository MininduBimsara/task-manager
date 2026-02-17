// Task validation schemas using Joi
import Joi from "joi";

const validStatuses = ["pending", "in-progress", "completed"];

/**
 * Schema for creating a new task
 * - Title is required, 1-200 characters
 * - Description is optional, max 1000 characters
 * - Status is optional, must be a valid status
 */
export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.min": "Title cannot be empty",
    "string.max": "Title must be less than 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Description must be less than 1000 characters",
    }),
  status: Joi.string()
    .valid(...validStatuses)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${validStatuses.join(", ")}`,
    }),
});

/**
 * Schema for updating an existing task
 * - All fields are optional but at least one must be provided
 * - Same validation rules as create
 */
export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional().messages({
    "string.min": "Title cannot be empty",
    "string.max": "Title must be less than 200 characters",
  }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Description must be less than 1000 characters",
    }),
  status: Joi.string()
    .valid(...validStatuses)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${validStatuses.join(", ")}`,
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
