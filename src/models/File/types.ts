import { Model, Types } from 'mongoose';
import { ModelBase } from 'types';

export interface IFileDTO extends ModelBase {
  name: string;
  owner: Types.ObjectId;
  storageKey: string;
  sizeMegabytes?: number;
  parentFile?: Types.ObjectId;
  directLink?: string;
  isFolder: boolean;
  isPrivate: boolean;
}

export interface IFileMethods {
  mapToDTO(): IFileDTO;
}

export interface IFile extends IFileDTO, IFileMethods {}

export type FileModel = Model<IFile, {}, IFileMethods>;
