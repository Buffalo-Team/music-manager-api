import { findIndex } from 'lodash';
import { format } from 'date-fns';
import { OperationType } from 'consts/enums';
import { IPopulatedOperation } from 'models/Operation/types';

const isOperationPresent = (
  operations: IPopulatedOperation[],
  operationType: OperationType
) =>
  findIndex(operations, (operation) => operation.type === operationType) >= 0;

const removeOperationsOnFile = (
  operations: IPopulatedOperation[],
  fileId: string
) => operations.filter((operation) => operation.file.toString() !== fileId);

const generateFilename = (deviceName: string) => {
  const dateString = format(new Date(), 'dd-MM-yyyy-Hm');
  return `music-${deviceName}-${dateString}.zip`;
};

export { isOperationPresent, removeOperationsOnFile, generateFilename };
