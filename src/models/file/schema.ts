import { Schema, model } from 'mongoose';
import normalizeOutput from 'utils/normalizeOutput';

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    storagePath: {
      type: String,
      required: true,
    },
    sizeMegabytes: {
      type: Number,
    },
    parentFile: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    isFolder: {
      type: Boolean,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

FileSchema.method('toJSON', normalizeOutput);

const File = model('File', FileSchema);

export default File;
