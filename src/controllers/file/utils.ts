import { set } from 'lodash';
import { IUploadRequest } from 'controllers/AWS/types';
import File, { IFile } from 'models/file';
import messages from 'consts/messages';
import { TFileCreate } from './types';

export const createFileIfNotExists = async (
  data: TFileCreate,
  req: IUploadRequest
): Promise<IFile> => {
  let file = await File.findOne({
    name: data.name,
    owner: data.owner,
    parentFile: data.parentFile,
    isFolder: data.isFolder,
  });

  if (!file) {
    file = await File.create(data);
  } else {
    set(req, 'warnings.alreadyExisted', true);
  }

  return file;
};

export const getWarnings = (req: IUploadRequest): string[] => {
  const warnings: string[] = [];
  if (req?.warnings?.alreadyExisted) {
    warnings.push(messages.someFilesAlreadyExisted);
  }

  if (req?.warnings?.wrongFormat) {
    warnings.push(messages.wrongFileType);
  }

  return warnings;
};
