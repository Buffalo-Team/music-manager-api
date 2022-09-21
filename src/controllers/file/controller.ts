import { NextFunction, Request, Response } from 'express';
import { isArray } from 'lodash';
import { Types } from 'mongoose';
import path from 'path';
import File, { IFile } from 'models/file';
import convertBytesToMegabytes from 'utils/convertBytesToMegabytes';
import { IMulterFile } from 'types';
import catchAsync from 'utils/catchAsync';
import AppError from 'utils/appError';
import { Status } from 'consts/enums';
import messages from 'consts/messages';
import UNKNOWN from 'consts/unknown';
import {
  createS3EmptyFolder,
  deleteFileFromS3,
  deleteFolderFromS3,
} from 'controllers/AWS';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateUpdateObjectCallback,
} from 'controllers/CRUDHandler';
import prepareName from 'utils/prepareName';
import {
  createFileIfNotExists,
  getFolderNestedFiles,
  getWarnings,
} from './utils';
import {
  ICreateFilesRequest,
  ICreateFolderRequest,
  TFileCreate,
} from './types';

export const getAllFiles = catchAsync(async (req: Request, res: Response) => {
  generateGetAllObjectsCallback({
    Object: File,
    dataKey: 'files',
    filter: {
      owner: req.user.id,
    },
    req,
    res,
  });
});

export const getOneFile = catchAsync(async (req: Request, res: Response) => {
  generateGetOneObjectCallback({
    Object: File,
    dataKey: 'file',
    filter: { owner: req.user.id },
    req,
    res,
  });
});

export const updateFile = catchAsync(async (req: Request, res: Response) => {
  generateUpdateObjectCallback({
    Object: File,
    dataKey: 'file',
    filter: { owner: req.user.id },
    req,
    res,
  });
});

export const deleteFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = { _id: req.params.id, owner: req.user.id };
    const requestedFile = await File.findOne(query);

    if (!requestedFile) {
      return next(new AppError(messages.fileNotExist, 400));
    }

    let deletedCount = 0;

    if (requestedFile.isFolder) {
      const nestedFiles = await getFolderNestedFiles(requestedFile.id);

      const filesIdsToDelete: Types.ObjectId[] = [requestedFile.id];
      filesIdsToDelete.push(...nestedFiles.map(({ id }) => id));

      await File.deleteMany({ _id: { $in: filesIdsToDelete } });
      await deleteFolderFromS3(requestedFile.storageKey);
      deletedCount = filesIdsToDelete.length;
    } else {
      await File.findOneAndDelete(query);
      await deleteFileFromS3(requestedFile.storageKey);
      deletedCount = 1;
    }

    res.status(200).json({
      deletedCount,
      status: Status.SUCCESS,
    });
  }
);

export const createFilesMatchingUploads = catchAsync(
  async (req: ICreateFilesRequest, res: Response) => {
    const files: IMulterFile[] = isArray(req.files) ? req.files : [];

    const creatingFilesPromises: Promise<IFile>[] = [];
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
