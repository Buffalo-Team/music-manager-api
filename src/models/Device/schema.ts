import { Schema, model } from 'mongoose';
import { DeviceType } from 'consts/enums';
import normalizeOutput from 'utils/normalizeOutput';
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
    isNew: {
      type: Boolean,
      default: true,
    },
    isSynchronizationNeeded: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

DeviceSchema.method('toJSON', normalizeOutput);

DeviceSchema.method('mapToDTO', function (this: IDevice): IDeviceDTO {
  return this;
});

const Device = model('Device', DeviceSchema);

export default Device;