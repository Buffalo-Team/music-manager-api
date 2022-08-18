import { Model, Types } from 'mongoose';

export interface IFile {
  name: string;
  owner: Types.ObjectId;
  storagePath: string;
  sizeMegabytes: number;
  parentFile: Types.ObjectId;
  isFolder: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFileDTO {
  name: string;
  owner: Types.ObjectId;
  storagePath: string;
  sizeMegabytes: number;
  parentFile: Types.ObjectId;
  isFolder: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFileMethods {
  mapToDTO(): IFileDTO;
}

export type FileModel = Model<IFile, {}, IFileMethods>;
