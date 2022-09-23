import { Request, Response } from 'express';
import catchAsync from 'utils/catchAsync';
import File from 'models/file';
import Device from 'models/device';
import User from 'models/user';
import { Role, Status } from 'consts/enums';
import { deleteFolderFromS3 } from './AWS';

export interface IClearDatabaseRequest extends Request {
  body: {
    force: boolean;
  };
}

export const clearTheDatabase = catchAsync(
  async (req: IClearDatabaseRequest, res: Response) => {
    let userFilter: { [key: string]: any } = { role: { $ne: Role.ADMIN } };
    const rootFolderS3 = '';

    if (req.body.force) {
      userFilter = {};
    }

    await Promise.all([
      File.deleteMany(),
      Device.deleteMany(),
      User.deleteMany(userFilter),
      deleteFolderFromS3(rootFolderS3),
    ]);

    res.status(204).json({
      status: Status.SUCCESS,
    });
  }
);
