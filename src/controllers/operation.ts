import { map } from 'lodash';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { OperationType } from 'consts/enums';
import Device from 'models/Device';
import Operation from 'models/Operation';
import catchAsync from 'utils/catchAsync';
import { generateGetAllObjectsCallback } from './CRUDHandler';

interface CreateOperationRecordProps {
  owner: Types.ObjectId;
  operationType: OperationType;
  fileId: Types.ObjectId;
  payload: {
    oldLocation?: string;
    newLocation?: string;
  };
}

export const createOperationRecord = async ({
  owner,
  operationType,
  fileId,
  payload,
}: CreateOperationRecordProps) => {
  const devices = await Device.find({ owner, isNew: false }).select('id');

  await Operation.create({
    owner,
    type: operationType,
    file: fileId,
    devices: map(devices, ({ id }) => id),
    payload,
  });
};

export const getAllOperations = catchAsync(
  async (req: Request, res: Response) => {
    generateGetAllObjectsCallback({
      Object: Operation,
      dataKey: 'operations',
      filter: {
        owner: req.user.id,
      },
      req,
      res,
    });
  }
);
