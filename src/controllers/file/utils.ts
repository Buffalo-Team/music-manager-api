import File, { IFile, IFileMethods } from 'models/file';
import { TFileCreate } from './types';

export const createFileIfNotExists = async (
  data: TFileCreate
): Promise<IFile & IFileMethods> => {
  let file = await File.findOne({
    name: data.name,
    owner: data.owner,
    parentFile: data.parentFile,
    isFolder: data.isFolder,
  });

  if (!file) {
    file = await File.create(data);
  }

  return file;
};
