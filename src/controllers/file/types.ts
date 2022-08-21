import { IFile } from 'models/file';
import { IUploadRequest } from 'controllers/AWS/types';

export type TFileCreate = Omit<
  IFile,
  'id' | 'createdAt' | 'updatedAt' | 'mapToDTO'
>;

export interface ICreateFilesRequest extends IUploadRequest {
  body: {
    isPrivate: boolean;
  };
}

export interface ICreateFolderRequest extends IUploadRequest {
  body: {
    name: string;
    isPrivate: boolean;
  };
}
