/**
 * Custom HTTP error classes for consistent error handling
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

