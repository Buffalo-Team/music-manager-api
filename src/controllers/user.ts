import { Request, Response } from 'express';
import User, { UserDTOSelect } from 'models/User';
import catchAsync from 'utils/catchAsync';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from './CRUDHandler';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  generateGetAllObjectsCallback({
    Object: User,
    dataKey: 'users',
    select: UserDTOSelect,
    req,
    res,
  });
});

export const getOneUser = catchAsync(async (req: Request, res: Response) => {
  generateGetOneObjectCallback({
    Object: User,
    dataKey: 'user',
    select: UserDTOSelect,
    req,
    res,
  });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  generateCreateObjectCallback({
    Object: User,
    dataKey: 'user',
    req,
    res,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  generateUpdateObjectCallback({
    Object: User,
    dataKey: 'user',
    select: UserDTOSelect,
    req,
    res,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  generateDeleteObjectCallback({
    Object: User,
    req,
    res,
  });
});
