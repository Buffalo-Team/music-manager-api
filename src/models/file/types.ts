import { Model, Types } from 'mongoose';

export interface IFileDTO {
  id: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  storageKey: string;
  sizeMegabytes?: number;
  parentFile?: Types.ObjectId;
  directLink?: string;
  isFolder: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFileMethods {
  mapToDTO(): IFileDTO;
}

export interface IFile extends IFileDTO, IFileMethods {}

export type FileModel = Model<IFile, {}, IFileMethods>;
