import multer from 'multer';
import multerS3 from 'multer-s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'node:path';
import { IMulterFile } from 'types';
import { IUploadRequest } from './types';

const s3 = new S3Client({
  region: 'eu-central-1',
});

export const uploadToS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key(req: IUploadRequest, file: IMulterFile, cb: any) {
      cb(null, path.join(req.uploadTarget, file.originalname));
    },
  }),
  fileFilter(req: IUploadRequest, file: IMulterFile, cb: any) {
    if (!file.mimetype.startsWith('audio')) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

export const createS3EmptyFolder = (folderPath: string): Promise<any> => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: folderPath,
  };
  const command = new PutObjectCommand(params);
  return s3.send(command);
};
