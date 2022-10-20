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
import { IPopulatedOperation } from 'models/Operation/types';
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

    let operations: IPopulatedOperation[] = await Operation.find({
      owner: req.user.id,
      devices: deviceId,
    }).populate('file');

    const operationsGroupedByFileId = groupBy(
      operations,
      (operation) => operation.file.id
    );

    operations = simplifyAddDeleteOperations(
      operations,
      operationsGroupedByFileId,
      'file.id'
    ) as IPopulatedOperation[];

    const fileAddOperations = filter(
      operations,
      ({ file, type }) => !file.isFolder && type === OperationType.ADD
    );

    const downloadedFiles = await Promise.all(
      map(fileAddOperations, ({ file }) => getFileFromAWS(file.storageKey))
    );

    const downloadedExeFile = await getFileFromAWS(exeFileKey);

    let zp = new Admz();
    zp = await addFilesToZip(zp, {
      downloaded: [
        ...map(downloadedFiles, (object, index) => ({
          ...object,
          Body: object.Body as Readable,
          name: fileAddOperations[index].file.name,
        })),
        {
          Body: downloadedExeFile.Body as Readable,
          name: exeFileName,
        },
      ],
      local: [exeReadmePath],
    });

    const dataJson = createJsonData(operations);
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

    await Operation.updateMany(
      {
        owner: req.user.id,
        ...(device.lastMissingFilesDownload && {
          createdAt: { $lt: device.lastMissingFilesDownload },
        }),
      },
      { $pull: { devices: req.params.id } }
    );

    res.status(200).json({
      status: Status.SUCCESS,
    });
  }
);
