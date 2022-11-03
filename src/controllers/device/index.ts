import { NextFunction, Request, Response } from 'express';
import { filter, groupBy, map } from 'lodash';
import Admz from 'adm-zip';
import { Readable } from 'stream';
import { OperationType, Status } from 'consts/enums';
import Device from 'models/Device';
import Operation from 'models/Operation';
import catchAsync from 'utils/catchAsync';
import { getFileFromAWS } from 'controllers/AWS';
import { IDevice } from 'models/Device/types';
import AppError from 'utils/appError';
import messages from 'consts/messages';
import { IOperation, IPopulatedOperation } from 'models/Operation/types';
import { exeFileKey, exeFileName, exeReadmePath } from 'consts/config';
import addFilesToZip from 'utils/addFilesToZip';
import {
  generateFilename,
  simplifyAddDeleteOperations,
  createJsonData,
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

    await Device.findByIdAndUpdate(device.id, {
      lastMissingFilesDownload: new Date(),
    });

    let operations: IOperation[] = await Operation.find({
      owner: req.user.id,
      devices: deviceId,
    });

    const operationsGroupedByFileId = groupBy(
      operations,
      (operation) => operation.file
    );

    operations = await simplifyAddDeleteOperations(
      operations,
      operationsGroupedByFileId
    );

    await Promise.all(
      map(
        operations,
        (operation) => operation.populate && operation.populate('file')
      )
    );

    // @ts-ignore
    const populatedOperations: IPopulatedOperation[] = operations;

    const fileAddOperations = filter(
      populatedOperations,
      ({ file, type }) => !file?.isFolder && type === OperationType.ADD
    );

    const downloadedFiles = await Promise.all(
      map(fileAddOperations, ({ file }) => getFileFromAWS(file!.storageKey))
    );

    const downloadedExeFile = await getFileFromAWS(exeFileKey);

    let zp = new Admz();
    zp = await addFilesToZip(zp, {
      downloaded: [
        ...map(downloadedFiles, (object, index) => ({
          ...object,
          Body: object.Body as Readable,
          name: fileAddOperations[index]!.file!.name,
        })),
        {
          Body: downloadedExeFile.Body as Readable,
          name: exeFileName,
        },
      ],
      local: [exeReadmePath],
    });

    const dataJson = createJsonData(populatedOperations);
    zp.addFile('data.json', Buffer.from(dataJson));

    const zipBuffer = zp.toBuffer();

    const ZIP_FILENAME = generateFilename(device.name);

    res.attachment(ZIP_FILENAME);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Length', `${zipBuffer.length}`);
    res.send(zipBuffer);
  }
);

export const markAsUpToDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return next(new AppError(messages.deviceNotFound, 404));
    }

    let updatedDevice;
    if (device.isSynchronizationNeeded) {
      updatedDevice = await Device.findByIdAndUpdate(
        req.params.id,
        {
          isSynchronizationNeeded: false,
        },
        { new: true }
      );
    } else {
      const operationsFilter = {
        owner: req.user.id,
        ...(device.lastMissingFilesDownload && {
          createdAt: { $lt: device.lastMissingFilesDownload },
        }),
      };

      const operations: IPopulatedOperation[] = await Operation.find(
        operationsFilter
      );

      await Operation.updateMany(operationsFilter, {
        $pull: { devices: req.params.id },
      });

      let allocatedMegabytesChange = 0;

      operations.forEach(({ type, fileSizeMegabytes }) => {
        if (type === OperationType.ADD) {
          allocatedMegabytesChange += fileSizeMegabytes;
        } else if (type === OperationType.DELETE) {
          allocatedMegabytesChange -= fileSizeMegabytes;
        }
      });

      updatedDevice = await Device.findByIdAndUpdate(
        device.id,
        {
          $inc: {
            allocatedMegabytes: Math.round(allocatedMegabytesChange * 10) / 10,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: Status.SUCCESS,
      device: updatedDevice,
    });
  }
);
