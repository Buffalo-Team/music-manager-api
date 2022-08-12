const User = require('../models/userModel');
const {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} = require('./CRUDHandler');

exports.getAllUsers = generateGetAllObjectsCallback(User, 'users');

exports.getOneUser = generateGetOneObjectCallback(User, 'user');

exports.createUser = generateCreateObjectCallback(User, 'user');

exports.updateUser = generateUpdateObjectCallback(User, 'user');

exports.deleteUser = generateDeleteObjectCallback(User);
