import { Model, Types } from 'mongoose';

export interface IUserDTO {
  id: Types.ObjectId;
  name: string;
  surname: string;
}

export interface IUserMethods {
  mapToDTO(): IUserDTO;
  isCorrectPassword(password: string): boolean;
}

export interface IUser extends IUserDTO, IUserMethods {
  email: string;
  password: string;
  passwordConfirm?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
