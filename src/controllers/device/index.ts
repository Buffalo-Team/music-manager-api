import { Request, Response } from 'express';
import { forEach, groupBy } from 'lodash';
import { OperationType, Status } from 'consts/enums';
import Device from 'models/Device';
import Operation, { IOperation } from 'models/Operation';
import catchAsync from 'utils/catchAsync';
import { isOperationPresent, removeOperationsOnFile } from './utils';
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
  async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    let operations: IOperation[] = await Operation.find({
      owner: req.user.id,
      devices: deviceId,
    });

    const groupedByFileId = groupBy(operations, (operation) => operation.file);

    forEach(
      groupedByFileId,
      (currentFileOperations: IOperation[], fileId: string) => {
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

    res.status(200).json({
      status: Status.SUCCESS,
    });
  }
);
