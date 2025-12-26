import { body, type ValidationChain } from "express-validator";
import { ValidationError } from "../utils/httpErrors";

/**
 * Validation rules for user creation
 */
export const createUser: ValidationChain[] = [
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
export const updateUser: ValidationChain[] = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty if provided")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("zipCode")
    .optional({ nullable: true })
    .custom((value) => {
      // Allow null to clear zipCode
      if (value === null || value === undefined) {
        return true;
      }
      // If provided, must be a non-empty string
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new ValidationError("Zip code cannot be empty if provided");
      }
      // Validate length
      if (value.trim().length < 3 || value.trim().length > 20) {
        throw new ValidationError("Zip code must be between 3 and 20 characters");
      }
      return true;
    }),
];

