import { Request } from 'express';

export interface IUploadRequest extends Request {
  uploadTarget: string;
  warnings: {
    alreadyExisted: boolean;
    wrongFormat: boolean;
  };
}
