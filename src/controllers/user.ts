import User from 'models/user';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from './CRUDHandler';

export const getAllUsers = generateGetAllObjectsCallback(User, 'users');

export const getOneUser = generateGetOneObjectCallback(User, 'user');

export const createUser = generateCreateObjectCallback(User, 'user');

export const updateUser = generateUpdateObjectCallback(User, 'user');

export const deleteUser = generateDeleteObjectCallback(User);
