import { NextFunction, Request, Response } from 'express';
import { filter, forEach, groupBy, map } from 'lodash';
import { Readable } from 'stream';
import { OperationType } from 'consts/enums';
import Device from 'models/Device';
import Operation from 'models/Operation';
import catchAsync from 'utils/catchAsync';
import { getFileFromAWS } from 'controllers/AWS';
import { IDevice } from 'models/Device/types';
import AppError from 'utils/appError';
import messages from 'consts/messages';
import createZipFromFiles from 'utils/createZipFromFiles';
import { IPopulatedOperation } from 'models/Operation/types';
import {
  generateFilename,
  isOperationPresent,
  removeOperationsOnFile,
} from './utils';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from '../CRUDHandler';

export const getAllDevices = catchAsync(async (req: Request, res: Response) => {
  generateGetAllObjectsCallback({
    Object: Device,
    dataKey: 'devices',
    filter: {
      owner: req.user.id,
    },
    req,
    res,
  });
});

export const getOneDevice = catchAsync(async (req: Request, res: Response) => {
  generateGetOneObjectCallback({
    Object: Device,
    dataKey: 'device',
    filter: { owner: req.user.id },
    req,
    res,
  });
});

export const createDevice = catchAsync(async (req: Request, res: Response) => {
  req.body.owner = req.user.id;
  generateCreateObjectCallback({ Object: Device, dataKey: 'device', req, res });
});

export const updateDevice = catchAsync(async (req: Request, res: Response) => {
  generateUpdateObjectCallback({
    Object: Device,
    dataKey: 'device',
    filter: { owner: req.user.id },
    req,
    res,
  });
});

export const deleteDevice = catchAsync(async (req: Request, res: Response) => {
  generateDeleteObjectCallback({
    Object: Device,
    filter: { owner: req.user.id },
    req,
    res,
  });
});

export const downloadMissingFiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.id;
    const device: IDevice | null = await Device.findById(deviceId);
    if (!device) {
      return next(new AppError(messages.deviceNotFound, 404));
    }

    let operations: IPopulatedOperation[] = await Operation.find({
      owner: req.user.id,
      devices: deviceId,
    }).populate('file');

    const operationsGroupedByFileId = groupBy(
      operations,
      (operation) => operation.file.id
    );

    // Simplify the operation list for each file
    forEach(
      operationsGroupedByFileId,
      (currentFileOperations: IPopulatedOperation[], fileId: string) => {
        const isDeleteOperation = isOperationPresent(
          currentFileOperations,
          OperationType.DELETE
        );
        const isAddOperation = isOperationPresent(
          currentFileOperations,
          OperationType.ADD
        );

        if (isDeleteOperation && isAddOperation) {
          operations = removeOperationsOnFile(operations, fileId);
        }
      }
    );

    const fileAddOperations = filter(
      operations,
      ({ file, type }) => !file.isFolder && type === OperationType.ADD
    );

    const downloadedFiles = await Promise.all(
      map(fileAddOperations, ({ file }) => getFileFromAWS(file.storageKey))
    );

    const zipData = await createZipFromFiles(
      map(downloadedFiles, (object, index) => ({
        ...object,
        Body: object.Body as Readable,
        name: fileAddOperations[index].file.name,
      }))
    );

    const ZIP_FILENAME = generateFilename(device.name);

    res.attachment(ZIP_FILENAME);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Length', `${zipData.length}`);
    res.send(zipData);
  }
);
