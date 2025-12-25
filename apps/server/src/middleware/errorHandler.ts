import type { Request, Response } from "express";
interface Error {
  statusCode?: number;
  message?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
): void {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}
