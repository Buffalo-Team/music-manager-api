import { NextFunction, Response } from 'express';
import { isArray } from 'lodash';
import { Types } from 'mongoose';
import path from 'path';
import File, { IFile, IFileMethods } from 'models/file';
import convertBytesToMegabytes from 'utils/convertBytesToMegabytes';
import { IMulterFile } from 'types';
import catchAsync from 'utils/catchAsync';
import AppError from 'utils/appError';
import { Status } from 'consts/enums';
import messages from 'consts/messages';
import UNKNOWN from 'consts/unknown';
import { createS3EmptyFolder } from 'controllers/AWS';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from 'controllers/CRUDHandler';
import prepareName from 'utils/prepareName';
import { createFileIfNotExists, getWarnings } from './utils';
import {
  ICreateFilesRequest,
  ICreateFolderRequest,
  TFileCreate,
} from './types';

export const getAllFiles = generateGetAllObjectsCallback(File, 'files');

export const getOneFile = generateGetOneObjectCallback(File, 'file');

export const updateFile = generateUpdateObjectCallback(File, 'file');

export const deleteFile = generateDeleteObjectCallback(File);

export const createFilesMatchingUploads = catchAsync(
  async (req: ICreateFilesRequest, res: Response) => {
    const files: IMulterFile[] = isArray(req.files) ? req.files : [];

    const creatingFilesPromises: Promise<IFile & IFileMethods>[] = [];
    const parentFileId = req.params.target;

    files.forEach((file: IMulterFile) => {
      const data: TFileCreate = {
        name: prepareName(file.originalname),
        owner: req.user.id,
        storageKey: file.key ?? UNKNOWN,
        sizeMegabytes: convertBytesToMegabytes(file.size ?? 0),
        directLink: file.location,
        parentFile: parentFileId ? new Types.ObjectId(parentFileId) : undefined,
        isFolder: false,
        isPrivate: req.body.isPrivate,
      };

      creatingFilesPromises.push(createFileIfNotExists(data, req));
    });

    const createdFiles = await Promise.all(creatingFilesPromises);

    res.status(201).json({
      status: Status.SUCCESS,
      files: createdFiles.map((file) => file.mapToDTO()),
      warnings: getWarnings(req),
    });
  }
);

export const createFolder = catchAsync(
  async (req: ICreateFolderRequest, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.isPrivate) {
      return next(
        new AppError(messages.missingSomeFields(['name', 'isPrivate']), 400)
      );
    }

    const storageKey = `${path.join(req.uploadTarget, req.body.name)}/`;
    createS3EmptyFolder(storageKey);

    const parentFileId = req.params.target;

    const data: TFileCreate = {
      name: req.body.name,
      owner: req.user.id,
      storageKey,
      parentFile: parentFileId ? new Types.ObjectId(parentFileId) : undefined,
      isFolder: true,
      isPrivate: req.body.isPrivate,
    };

    const folder = await createFileIfNotExists(data, req);

    res.status(201).json({
      status: Status.SUCCESS,
      folder: folder.mapToDTO(),
      warnings: getWarnings(req),
    });
  }
);
