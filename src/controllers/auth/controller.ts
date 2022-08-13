import { Status } from 'consts/enums';
import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser, IUserMethods } from 'models/user';
import IRequest from 'types/Request';
import catchAsync from 'utils/catchAsync';
import { ILoginRequest, ISignupRequest } from './types';

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: IUser & IUserMethods,
  statusCode: number,
  req: IRequest,
  res: Response
) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN)),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: Status.SUCCESS,
    token,
    user: user.mapToDTO(),
  });
};

export const signup = catchAsync(async (req: ISignupRequest, res: Response) => {
  const { name, surname, email, password, passwordConfirm } = req.body;
  const user = await User.create({
    name: name.trim(),
    surname: surname.trim(),
    email: email.toLowerCase().trim(),
    password,
    passwordConfirm,
  });

  createSendToken(user, 201, req, res);
});

export const login = catchAsync(
  async (req: ILoginRequest, res: Response, next: NextFunction) => {
    const email = req.body.email.trim();
    const { password } = req.body;

    if (!email || !password) {
      // TODO Handle Error
      return next();
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.isCorrectPassword(password))) {
      // TODO Handle Error
      return next();
    }

    createSendToken(user, 200, req, res);
  }
);

export const logout = catchAsync(async (req: IRequest, res: Response) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', 'loggedout', cookieOptions);

  res.status(200).json({
    status: Status.SUCCESS,
  });
});

export const getLoggedUser = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(200).json({
        status: Status.SUCCESS,
        user: null,
      });
    }
    // 1) verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId: string = (<JwtPayload>decoded).id;

    const logoutCookieOptions = {
      // do wylogowania w razie errora
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    };

    // 2) Check if user still exists
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.cookie('jwt', 'loggedout', logoutCookieOptions);
      // TODO Handle Error
      return next();
    }

    return res.status(200).json({
      status: Status.SUCCESS,
      user: currentUser.mapToDTO(),
    });
  }
);
