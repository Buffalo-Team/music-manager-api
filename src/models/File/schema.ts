import { Schema, model } from 'mongoose';
import normalizeOutput from 'utils/normalizeOutput';
import { FileModel, IFile, IFileDTO, IFileMethods } from './types';

const FileSchema = new Schema<IFile, FileModel, IFileMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    storageKey: {
      type: String,
      required: true,
    },
    directLink: String,
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

FileSchema.method('mapToDTO', function (this: IFile): IFileDTO {
  return this;
});

const File = model('File', FileSchema);

export default File;
