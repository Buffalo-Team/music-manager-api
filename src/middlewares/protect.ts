import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from 'utils/catchAsync';
import User from 'models/user';
import IRequest from 'types/Request';

export default catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      // TODO Handle Error
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId: string = (<JwtPayload>decoded).id;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      // TODO Handle Error
      return next();
    }

    req.user = currentUser;
    next();
  }
);
