import { CookieOptions, NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Environment, Role, Status } from 'consts/enums';
import messages from 'consts/messages';
import User, { IUser } from 'models/User';
import AppError from 'utils/appError';
import catchAsync from 'utils/catchAsync';
import { ILoginRequest, ISignupRequest } from './types';

const environment: Environment =
  Environment[process.env.ENVIRONMENT as keyof typeof Environment] ||
  Environment.development;

const signToken = (id: Types.ObjectId): string =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN)),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: environment !== Environment.development ? 'none' : undefined,
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: Status.SUCCESS,
    token,
    user: user.mapToDTO(),
  });
};

export const signup = catchAsync(async (req: ISignupRequest, res: Response) => {
  const { name, surname, email, role, password, passwordConfirm } = req.body;
  const user = await User.create({
    name: name.trim(),
    surname: surname.trim(),
    email: email.toLowerCase().trim(),
    role: role || Role.USER,
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
      return next(new AppError(messages.missingEmailOrPassword, 404));
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.isCorrectPassword(password))) {
      return next(new AppError(messages.invalidEmailOrPassword, 401));
    }

    createSendToken(user, 200, req, res);
  }
);

export const logout = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: environment !== Environment.development ? 'none' : undefined,
  };

  res.cookie('jwt', 'loggedout', cookieOptions);

  res.status(200).json({
    status: Status.SUCCESS,
  });
});

export const getLoggedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(200).json({
        status: Status.SUCCESS,
        user: null,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId: string = (<JwtPayload>decoded).id;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: environment !== Environment.development ? 'none' : undefined,
      });
      return next(new AppError(messages.sessionExpired, 401));
    }

    return res.status(200).json({
      status: Status.SUCCESS,
      user: currentUser.mapToDTO(),
    });
  }
);
