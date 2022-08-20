import { Request } from 'express';

export interface IUploadRequest extends Request {
  uploadTarget: string;
}
