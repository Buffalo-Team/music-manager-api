import File from 'models/file';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from './CRUDHandler';

export const getAllFiles = generateGetAllObjectsCallback(File, 'files');

export const getOneFile = generateGetOneObjectCallback(File, 'file');

export const createFile = generateCreateObjectCallback(File, 'file');

export const updateFile = generateUpdateObjectCallback(File, 'file');

export const deleteFile = generateDeleteObjectCallback(File);
