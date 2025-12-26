import type { Request, Response } from "express";
import type { ApiResponse } from "../types";
import { HttpError } from "../utils/httpErrors";

/**
 * Express error handler middleware
 * Handles HttpError instances and other errors, converting them to consistent API responses
 */
export function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response
): void {
  // HttpError instances have a statusCode property
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const response: ApiResponse = {
    success: false,
    message: err.message || "Internal Server Error",
  };
  res.status(statusCode).json(response);
}
