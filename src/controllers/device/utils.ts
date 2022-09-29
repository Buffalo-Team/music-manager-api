import { findIndex } from 'lodash';
import { OperationType } from 'consts/enums';
import { IOperation } from 'models/Operation';

const isOperationPresent = (
  operations: IOperation[],
  operationType: OperationType
) =>
  findIndex(operations, (operation) => operation.type === operationType) >= 0;

const removeOperationsOnFile = (operations: IOperation[], fileId: string) =>
  operations.filter((operation) => operation.file.toString() !== fileId);

export { isOperationPresent, removeOperationsOnFile };
