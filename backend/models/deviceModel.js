const mongoose = require('mongoose');
const deviceTypes = require('../consts/deviceTypes');

const DeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(deviceTypes),
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
        type: mongoose.Schema.ObjectId,
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

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;
