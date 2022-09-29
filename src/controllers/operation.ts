import { map } from 'lodash';
import { Types } from 'mongoose';
import { OperationType } from 'consts/enums';
import Device from 'models/Device';
import Operation from 'models/Operation';

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
    type: operationType,
    file: fileId,
    devices: map(devices, ({ id }) => id),
    payload,
  });
};
