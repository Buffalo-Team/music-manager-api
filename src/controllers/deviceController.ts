import Device from 'models/deviceModel';
import {
  generateGetAllObjectsCallback,
  generateGetOneObjectCallback,
  generateCreateObjectCallback,
  generateUpdateObjectCallback,
  generateDeleteObjectCallback,
} from './CRUDHandler';

export const getAllDevices = generateGetAllObjectsCallback(Device, 'devices');

export const getOneDevice = generateGetOneObjectCallback(Device, 'device');

export const createDevice = generateCreateObjectCallback(Device, 'device');

export const updateDevice = generateUpdateObjectCallback(Device, 'device');

export const deleteDevice = generateDeleteObjectCallback(Device);
