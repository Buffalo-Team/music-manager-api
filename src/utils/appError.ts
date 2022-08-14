class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }
}

export default AppError;
