import multer from 'multer';
import multerS3 from 'multer-s3';
import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  S3Client,
  DeleteObjectsCommand,
  ObjectIdentifier,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { set } from 'lodash';
import fs from 'fs';
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

export const uploadLocalFileToS3 = async (filepath: string, key: string) => {
  const fileContent = fs.readFileSync(filepath);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileContent,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

export const createS3EmptyFolder = async (folderPath: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: folderPath,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

export const deleteFileFromS3 = async (filePath: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};

// KEEP IN MIND - Maybe it will fail for deleting more than 1000 files
// Copied and modified from https://stackoverflow.com/a/48955582
export const deleteFolderFromS3 = async (folderPath: string) => {
  const listParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: folderPath,
  };

  const listCommand = new ListObjectsCommand(listParams);
  const listedObjects = await s3.send(listCommand);

  if (!listedObjects?.Contents?.length) return;

  const ObjectsToDelete: ObjectIdentifier[] = [];

  listedObjects.Contents.forEach(({ Key }) => {
    ObjectsToDelete.push({ Key });
  });

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: { Objects: ObjectsToDelete },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  await s3.send(deleteCommand);

  if (listedObjects.IsTruncated) await deleteFolderFromS3(folderPath);
};

export const getFileFromAWS = (Key: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
  };

  const getCommand = new GetObjectCommand(params);

  return s3.send(getCommand);
};
