import { Model, Types } from 'mongoose';

export interface IFile {
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

export type FileModel = Model<IFile, {}, IFileMethods>;
