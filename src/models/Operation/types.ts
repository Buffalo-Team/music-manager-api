import { Model, Types } from 'mongoose';
import { OperationType } from 'consts/enums';
import { ModelBase } from 'types';

export interface IOperationDTO extends ModelBase {
  owner: Types.ObjectId;
  type: OperationType;
  file: Types.ObjectId;
  devices: Types.ObjectId[];
  payload: {
    oldLocation: String;
    newLocation: String;
  };
}

export interface IOperationMethods {
  mapToDTO(): IOperationDTO;
}

export interface IOperation extends IOperationDTO, IOperationMethods {}

export type OperationModel = Model<IOperation, {}, IOperationMethods>;
