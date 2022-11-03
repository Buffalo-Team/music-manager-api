import { flatten, set } from 'lodash';
import { Types } from 'mongoose';
import { IUploadRequest } from 'controllers/AWS/types';
import File, { IFile } from 'models/File';
import messages from 'consts/messages';
import { OperationType } from 'consts/enums';
import { createOperationRecord } from 'controllers/operation';
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

    createOperationRecord({
      operationType: OperationType.ADD,
      owner: req.user.id,
      file,
      payload: {
        newLocation: file.storageKey,
      },
    });
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

export const getFolderNestedFiles = async (
  folderId: Types.ObjectId
): Promise<IFile[]> => {
  const firstLevelNestedFiles: IFile[] = await File.find({
    parentFile: folderId,
  });
  const allNestedFiles = [...firstLevelNestedFiles];

  const promises: Promise<IFile[]>[] = [];
  firstLevelNestedFiles.forEach((firstLevelFile) => {
    if (firstLevelFile.isFolder) {
      const findNestedFilesPromise = getFolderNestedFiles(firstLevelFile.id);
      promises.push(findNestedFilesPromise);
    }
  });

  const results = await Promise.all(promises);

  allNestedFiles.push(...flatten(results));
  return allNestedFiles;
};
