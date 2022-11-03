import { Model, Types } from 'mongoose';
import { DeviceType } from 'consts/enums';
import { ModelBase } from 'types';

export interface IDeviceDTO extends ModelBase {
  name: string;
  type: DeviceType;
  owner: Types.ObjectId;
  capacityMegabytes: number;
  allocatedMegabytes: number;
  isSynchronizationNeeded: boolean;
  missingFilesCount?: number;
  deletedFilesCount?: number;
  lastMissingFilesDownload?: Date;
}

export interface IDeviceMethods {
  mapToDTO(): IDeviceDTO;
}

export interface IDevice extends IDeviceDTO, IDeviceMethods {}

export type DeviceModel = Model<IDevice, {}, IDeviceMethods>;
