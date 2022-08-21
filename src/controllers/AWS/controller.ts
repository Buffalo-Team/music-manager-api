import multer from 'multer';
import multerS3 from 'multer-s3';
import {
  PutObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { set } from 'lodash';
import path from 'node:path';
import { IMulterFile } from 'types';
import prepareName from 'utils/prepareName';
import { IUploadRequest } from './types';

const s3 = new S3Client({
  region: 'eu-central-1',
});

const existsInS3 = async (fileKey: string): Promise<boolean> => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new HeadObjectCommand(params);
    await s3.send(command);

    return true;
  } catch {
    return false;
  }
};

const createS3Key = (uploadTarget: string, filename: string) =>
  path.join(uploadTarget, prepareName(filename));

export const uploadToS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key(req: IUploadRequest, file: IMulterFile, cb: any) {
      cb(null, createS3Key(req.uploadTarget, file.originalname));
    },
  }),
  async fileFilter(req: IUploadRequest, file: IMulterFile, cb: any) {
    const fileAlreadyExist = await existsInS3(
      createS3Key(req.uploadTarget, file.originalname)
    );

    const isWrongFileFormat = !file.mimetype.startsWith('audio');

    if (isWrongFileFormat || fileAlreadyExist) {
      if (isWrongFileFormat) {
        set(req, 'warnings.wrongFormat', true);
      }
      if (fileAlreadyExist) {
        set(req, 'warnings.alreadyExisted', true);
      }
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
