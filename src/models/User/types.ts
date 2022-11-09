import { Model } from 'mongoose';
import { Role } from 'consts/enums';
import { ModelBase } from 'types';

export interface IUserDTO extends ModelBase {
  name: string;
  surname: string;
  role: Role;
  email: string;
}

export interface IUserMethods {
  mapToDTO(): IUserDTO;
  isCorrectPassword(password: string): boolean;
}

export interface IUser extends IUserDTO, IUserMethods {
  password: string;
  passwordConfirm?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
