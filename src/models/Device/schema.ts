import { Schema, model } from 'mongoose';
import { forEach, map } from 'lodash';
import { DeviceType, OperationType } from 'consts/enums';
import normalizeOutput from 'utils/normalizeOutput';
import Operation, { IOperation } from 'models/Operation';
import { DeviceModel, IDevice, IDeviceDTO, IDeviceMethods } from './types';
import { countOperationTypes } from './utils';

const DeviceSchema = new Schema<IDevice, DeviceModel, IDeviceMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(DeviceType),
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    capacityMegabytes: {
      type: Number,
      required: true,
    },
    allocatedMegabytes: {
      type: Number,
      default: 0,
    },
    isSynchronizationNeeded: {
      type: Boolean,
      default: true,
    },
    lastMissingFilesDownload: Date,
  },
  { timestamps: true }
);

DeviceSchema.post('find', async (devices) => {
  const operationsForDevices = await Promise.all(
    map(devices, ({ id }) => Operation.find({ devices: id }))
  );

  forEach(devices, (device: { _doc: IDevice }, index: number) => {
    const counts = countOperationTypes(operationsForDevices[index]);

    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    device._doc.missingFilesCount = counts[OperationType.ADD] || 0;
  });
});

DeviceSchema.post('findOne', async (device) => {
  const operations: IOperation[] = await Operation.find({
    devices: device.id,
  });

  const counts = countOperationTypes(operations);

  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  device._doc.missingFilesCount = counts[OperationType.ADD] || 0;
});

DeviceSchema.method('toJSON', normalizeOutput);

DeviceSchema.method('mapToDTO', function (this: IDevice): IDeviceDTO {
  return this;
});

const Device = model('Device', DeviceSchema);

export default Device;
