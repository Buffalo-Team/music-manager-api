import { Model, Types } from 'mongoose';
import { DeviceType } from 'consts/enums';
import { ModelBase } from 'types';

export interface IDeviceDTO extends ModelBase {
  name: string;
  type: DeviceType;
  owner: Types.ObjectId;
  capacityMegabytes: number;
  allocatedMegabytes: number;
  isNew: boolean;
  isSynchronizationNeeded: boolean;
  missingFilesCount?: number;
}

export interface IDeviceMethods {
  mapToDTO(): IDeviceDTO;
}

export interface IDevice extends IDeviceDTO, IDeviceMethods {}

export type DeviceModel = Model<IDevice, {}, IDeviceMethods>;
