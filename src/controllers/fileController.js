const File = require('../models/fileModel');
const {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} = require('./CRUDHandler');

exports.getAllFiles = generateGetAllObjectsCallback(File, 'files');

exports.getOneFile = generateGetOneObjectCallback(File, 'file');

exports.createFile = generateCreateObjectCallback(File, 'file');

exports.updateFile = generateUpdateObjectCallback(File, 'file');

exports.deleteFile = generateDeleteObjectCallback(File);
