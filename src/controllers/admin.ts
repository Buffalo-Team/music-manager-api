import { Request, Response } from 'express';
import catchAsync from 'utils/catchAsync';
import File from 'models/File';
import Device from 'models/Device';
import User from 'models/User';
import { Role, Status } from 'consts/enums';
import Operation from 'models/Operation';
import generateExeFileAndUploadToS3 from 'utils/generateExeFileAndUploadToS3';
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
      Operation.deleteMany(),
      User.deleteMany(userFilter),
      deleteFolderFromS3(rootFolderS3),
    ]);

    res.status(204).json({
      status: Status.SUCCESS,
    });
  }
);

export const generateExe = catchAsync(async (req: Request, res: Response) => {
  await generateExeFileAndUploadToS3();

  res.status(200).json({
    status: Status.SUCCESS,
  });
});
