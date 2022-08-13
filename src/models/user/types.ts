import { Model } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  devices: string[];
}

export interface IUserDTO {
  id: string;
  name: string;
  surname: string;
  email?: string;
  devices?: string[];
}

export interface IUserMethods {
  mapToDTO(): IUserDTO;
  isCorrectPassword(password: string): boolean;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
