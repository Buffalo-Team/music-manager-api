import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from 'utils/catchAsync';
import User from 'models/user';
import AppError from 'utils/appError';
import messages from 'consts/messages';

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError(messages.loginToAccess, 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId: string = (<JwtPayload>decoded).id;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      return next(new AppError(messages.sessionExpired, 401));
    }

    req.user = currentUser;
    next();
  }
);
