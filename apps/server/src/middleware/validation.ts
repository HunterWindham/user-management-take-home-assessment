import { type ValidationChain, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

/**
 * Reusable validation middleware that accepts validation chains
 * and handles validation errors
 *
 * @param validations - Array of validation chains to apply
 * @returns Express middleware function
 *
 * @example
 * ```ts
 * router.post("/", validate(userValidation.createUser), controller.create);
 * ```
 */
export function validate(validations: ValidationChain[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    next();
  };
}
