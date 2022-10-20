import { Schema, model } from 'mongoose';
import { OperationType } from 'consts/enums';
import normalizeOutput from 'utils/normalizeOutput';
import {
  OperationModel,
  IOperation,
  IOperationDTO,
  IOperationMethods,
} from './types';

const OperationSchema = new Schema<
  IOperation,
  OperationModel,
  IOperationMethods
>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: Object.values(OperationType),
      required: true,
    },
    file: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    fileSizeMegabytes: {
      type: Number,
      default: 0,
    },
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
    payload: {
      oldLocation: String,
      newLocation: String,
    },
  },
  { timestamps: true }
);

OperationSchema.method('toJSON', normalizeOutput);

OperationSchema.method('mapToDTO', function (this: IOperation): IOperationDTO {
  return this;
});

const Operation = model('Operation', OperationSchema);

export default Operation;
