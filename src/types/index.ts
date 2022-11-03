import { Types } from 'mongoose';

export interface IMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size?: number;
  key?: string;
  location?: string;
}

interface MongooseMethods {
  populate?: (path: string) => void;
  depopulate?: (path: string) => void;
}

export interface ModelBase extends MongooseMethods {
  id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}
