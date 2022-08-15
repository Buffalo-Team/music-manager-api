export type TFieldMessageMap = {
  [key: string]: string;
};

class AppError extends Error {
  statusCode: number;
  fieldMessageMap?: TFieldMessageMap;

  constructor(
    message: string,
    statusCode: number,
    fieldMessageMap?: TFieldMessageMap
  ) {
    super(message);
    this.statusCode = statusCode;
    this.fieldMessageMap = fieldMessageMap;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
