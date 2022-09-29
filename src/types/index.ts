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

export interface ModelBase {
  id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}
