import { Model, Types } from 'mongoose';
import { DeviceType } from 'consts/enums';

export interface IDevice {
  name: string;
  type: DeviceType;
  capacityMegabytes: number;
  allocatedMegabytes: number;
  missingFiles: Types.ObjectId[];
  isSynchronizationNeeded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeviceDTO {
  name: string;
  type: DeviceType;
  capacityMegabytes: number;
  allocatedMegabytes: number;
  missingFiles: Types.ObjectId[];
  isSynchronizationNeeded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeviceMethods {
  mapToDTO(): IDeviceDTO;
}

export type DeviceModel = Model<IDevice, {}, IDeviceMethods>;
