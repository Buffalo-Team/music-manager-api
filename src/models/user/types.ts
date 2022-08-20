import { Model, Types } from 'mongoose';

export interface IUser {
  id: Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  devices: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserDTO {
  id: Types.ObjectId;
  name: string;
  surname: string;
  devices: Types.ObjectId[];
}

export interface IUserMethods {
  mapToDTO(): IUserDTO;
  isCorrectPassword(password: string): boolean;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
