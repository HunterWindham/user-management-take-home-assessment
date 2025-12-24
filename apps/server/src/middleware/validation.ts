import {
  body,
  type ValidationChain,
  validationResult,
} from "express-validator";
import type { Request, Response, NextFunction } from "express";

/**
 * Validation rules for user creation
 */
export const validateUserCreate: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("zipCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Zip code cannot be empty if provided")
    .isLength({ min: 3, max: 20 })
    .withMessage("Zip code must be between 3 and 20 characters"),
];

/**
 * Validation rules for user update
 */
export const validateUserUpdate: ValidationChain[] = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty if provided")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("zipCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Zip code cannot be empty if provided")
    .isLength({ min: 3, max: 20 })
    .withMessage("Zip code must be between 3 and 20 characters"),
];

/**
 * Middleware to check validation results
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
    });
    return;
  }
  next();
}
