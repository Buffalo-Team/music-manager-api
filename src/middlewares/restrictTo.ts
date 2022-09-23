import { NextFunction, Request, Response } from 'express';
import AppError from 'utils/appError';
import messages from 'consts/messages';
import { Role } from 'consts/enums';

export default (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === Role.ADMIN) return next();

    if (!roles.includes(req.user.role)) {
      return next(new AppError(messages.permissionDenied, 403));
    }

    next();
  };
