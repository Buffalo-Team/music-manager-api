import { NextFunction, Response } from 'express';
import { IUploadRequest } from 'controllers/AWS/types';
import AppError from 'utils/appError';
import catchAsync from 'utils/catchAsync';
import File from 'models/file';
import messages from 'consts/messages';

export default catchAsync(
  async (req: IUploadRequest, res: Response, next: NextFunction) => {
    let uploadTarget = `${req.user.id}`;

    if (req.params.target) {
      const parentFile = await File.findById(req.params.target);
      if (!parentFile) {
        return next(new AppError(messages.directoryNotExist, 400));
      }
      uploadTarget = parentFile.storageKey;
    }

    req.uploadTarget = uploadTarget;

    next();
  }
);
