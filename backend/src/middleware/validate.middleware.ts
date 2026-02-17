// Joi validation middleware
import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

/**
 * Creates an Express middleware that validates request body against a Joi schema.
 * Returns 400 with details if validation fails, otherwise passes to next handler.
 */
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields from the body
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      res.status(400).json({
        message: "Validation failed",
        errors: errorMessages,
      });
      return;
    }

    next();
  };
};
