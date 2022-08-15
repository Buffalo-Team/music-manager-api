import { NextFunction, Response } from 'express';
import { forEach } from 'lodash';
import { MongoServerError } from 'mongodb';
import messages from 'consts/messages';
import IRequest from 'types/Request';
import AppError, { TFieldMessageMap } from 'utils/appError';
import { Status } from 'consts/enums';

const handleDuplicateFieldsDB = (err: MongoServerError): AppError => {
  const value = Object.keys(err.keyValue)[0];
  const message = messages.fieldIsTaken(value);
  return new AppError(message, 400);
};

const handleCastErrorDB = (err: MongoServerError): AppError => {
  const message = messages.invalidPathValue(err.path, err.value);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongoServerError): AppError => {
  const fieldMessageMap: TFieldMessageMap = {};
  forEach(err.errors, (value, key) => {
    fieldMessageMap[key] = value.message;
  });
  const message = messages.validationFailed;
  return new AppError(message, 400, fieldMessageMap);
};

const handleJWTError = () => new AppError(messages.loginToAccess, 401);

const handleJWTExpiredError = () => new AppError(messages.sessionExpired, 401);

const handleObjectIdError = () =>
  new AppError(messages.requestedDataNotFound, 404);

export default (
  err: Error | MongoServerError | AppError,
  req: IRequest,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let error: AppError = err as AppError;

  if (
    err.name === 'MongoServerError' &&
    (err as MongoServerError).code === 11000
  ) {
    error = handleDuplicateFieldsDB(err as MongoServerError);
  } else if (err.name === 'CastError') {
    error = handleCastErrorDB(err as MongoServerError);
  } else if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(err as MongoServerError);
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else if ((err as MongoServerError).kind === 'ObjectId') {
    error = handleObjectIdError();
  }

  if (!error.statusCode) {
    error.statusCode = 500;
  }

  res.status(error.statusCode).json({
    status: Status.ERROR,
    statusCode: error.statusCode,
    message: error.message,
    fieldMessageMap: error.fieldMessageMap,
    stack: error.stack,
  });
};
