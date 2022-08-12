import { Request, Response } from 'express';
import User from 'models/userModel';
import catchAsync from 'utils/catchAsync';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user,
  });
});
