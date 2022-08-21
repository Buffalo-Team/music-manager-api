import { Model, Types } from 'mongoose';
import { DeviceType } from 'consts/enums';

export interface IDeviceDTO {
  id: Types.ObjectId;
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

export interface IDevice extends IDeviceDTO, IDeviceMethods {}

export type DeviceModel = Model<IDevice, {}, IDeviceMethods>;
