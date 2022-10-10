import { Schema, model } from 'mongoose';
import { forEach, map } from 'lodash';
import { DeviceType } from 'consts/enums';
import normalizeOutput from 'utils/normalizeOutput';
import Operation from 'models/Operation';
import { DeviceModel, IDevice, IDeviceDTO, IDeviceMethods } from './types';

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
  },
  { timestamps: true }
);

DeviceSchema.post('find', async (devices) => {
  const addOperationCountList = await Promise.all(
    map(devices, ({ id }) => Operation.find({ devices: id }).count())
  );

  forEach(devices, (device: { _doc: IDevice }, index: number) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    device._doc.missingFilesCount = addOperationCountList[index];
  });
});

DeviceSchema.post('findOne', async (device) => {
  const addOperationCount = await Operation.find({
    devices: device.id,
  }).count();

  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  device._doc.missingFilesCount = addOperationCount;
});

DeviceSchema.method('toJSON', normalizeOutput);

DeviceSchema.method('mapToDTO', function (this: IDevice): IDeviceDTO {
  return this;
});

const Device = model('Device', DeviceSchema);

export default Device;
