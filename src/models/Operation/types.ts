import { Model, Types } from 'mongoose';
import { OperationType } from 'consts/enums';
import { ModelBase } from 'types';
import { IFile } from 'models/File';

export interface IOperationDTO extends ModelBase {
  owner: Types.ObjectId;
  type: OperationType;
  file: Types.ObjectId;
  devices: Types.ObjectId[];
  payload: {
    oldLocation: string;
    newLocation: string;
  };
}

export interface IOperationMethods {
  mapToDTO(): IOperationDTO;
}

export interface IOperation extends IOperationDTO, IOperationMethods {}
export interface IPopulatedOperation extends Omit<IOperation, 'file'> {
  file: IFile;
}

export type OperationModel = Model<IOperation, {}, IOperationMethods>;
