import { findIndex, forEach, get } from 'lodash';
import { format } from 'date-fns';
import { OperationType } from 'consts/enums';
import { IOperation, IPopulatedOperation } from 'models/Operation/types';

type IIdKey = 'file' | 'file.id';
type IMaybePopulatedOperation = IPopulatedOperation | IOperation;

const isOperationPresent = (
  operations: IMaybePopulatedOperation[],
  operationType: OperationType
) =>
  findIndex(operations, (operation) => operation.type === operationType) >= 0;

const removeOperationsOnFile = (
  operations: IMaybePopulatedOperation[],
  fileId: string,
  idKey: IIdKey
) =>
  operations.filter((operation) => get(operation, idKey).toString() !== fileId);

const generateFilename = (deviceName: string) => {
  const dateString = format(new Date(), 'dd-MM-yyyy-Hm');
  return `music-${deviceName}-${dateString}.zip`;
};

interface IGroupedOperations {
  [key: string]: IMaybePopulatedOperation[];
}

const simplifyAddDeleteOperations = (
  operations: IMaybePopulatedOperation[],
  operationsGroupedByFileId: IGroupedOperations,
  idKey: IIdKey
) => {
  // Simplify the operation list for each file
  let simplifiedOperations = [...operations];

  forEach(
    operationsGroupedByFileId,
    (currentFileOperations: IMaybePopulatedOperation[], fileId: string) => {
      const isDeleteOperation = isOperationPresent(
        currentFileOperations,
        OperationType.DELETE
      );
      const isAddOperation = isOperationPresent(
        currentFileOperations,
        OperationType.ADD
      );

      if (isDeleteOperation && isAddOperation) {
        simplifiedOperations = removeOperationsOnFile(
          simplifiedOperations,
          fileId,
          idKey
        );
      }
    }
  );

  return simplifiedOperations;
};

export { generateFilename, simplifyAddDeleteOperations };
