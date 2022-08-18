import User, { UserDTOSelect } from 'models/user';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from './CRUDHandler';

export const getAllUsers = generateGetAllObjectsCallback(
  User,
  'users',
  UserDTOSelect
);

export const getOneUser = generateGetOneObjectCallback(
  User,
  'user',
  UserDTOSelect
);

export const createUser = generateCreateObjectCallback(User, 'user');

export const updateUser = generateUpdateObjectCallback(
  User,
  'user',
  UserDTOSelect
);

export const deleteUser = generateDeleteObjectCallback(User);
