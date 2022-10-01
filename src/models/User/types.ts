import { Model } from 'mongoose';
import { Role } from 'consts/enums';
import { ModelBase } from 'types';

export interface IUserDTO extends ModelBase {
  name: string;
  surname: string;
  role: Role;
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
