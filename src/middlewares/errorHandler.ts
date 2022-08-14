import { Status } from 'consts/enums';
import { NextFunction, Response } from 'express';
import IRequest from 'types/Request';
import AppError from 'utils/appError';

export default (
  err: AppError,
  req: IRequest,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.setStatusCode(500);
  }

  res.status(err.statusCode).json({
    status: Status.ERROR,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};
