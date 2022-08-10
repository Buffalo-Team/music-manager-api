const Device = require('../models/deviceModel');
const {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} = require('./CRUDHandler');

exports.getAllDevices = generateGetAllObjectsCallback(Device, 'devices');

exports.getOneDevice = generateGetOneObjectCallback(Device, 'device');

exports.createDevice = generateCreateObjectCallback(Device, 'device');

exports.updateDevice = generateUpdateObjectCallback(Device, 'device');

exports.deleteDevice = generateDeleteObjectCallback(Device);
