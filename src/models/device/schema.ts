import { Schema, model } from 'mongoose';
import { DeviceType } from 'consts/enums';
import normalizeOutput from 'utils/normalizeOutput';

const DeviceSchema = new Schema(
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
    capacityMegabytes: {
      type: Number,
      required: true,
    },
    allocatedMegabytes: {
      type: Number,
      default: 0,
    },
    missingFiles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    isSynchronizationNeeded: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

DeviceSchema.method('toJSON', normalizeOutput);

const Device = model('Device', DeviceSchema);

export default Device;
