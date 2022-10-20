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
  const dateString = format(new Date(), 'dd-MM-yyyy-HHmm');
  return `music-${deviceName}-${dateString}.zip`;
};

const PATH_DELIMITER = '/';
const ROOT_PATH = '/';

const removeFirstAndLastPartOfPath = (path: string) =>
  path.split(PATH_DELIMITER).slice(1, -1).join(PATH_DELIMITER);

const createJsonData = (operations: IPopulatedOperation[]): string =>
  JSON.stringify({
    operations: operations.map((operation) => {
      let path =
        operation.type === OperationType.ADD
          ? operation.payload.newLocation
          : operation.payload.oldLocation;

      path = removeFirstAndLastPartOfPath(path);

      return {
        type: operation.type,
        path: path || ROOT_PATH,
        fileName: operation.file.name,
        isFolder: operation.file.isFolder,
      };
    }),
  });

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

export {
  isOperationPresent,
  removeOperationsOnFile,
  generateFilename,
  simplifyAddDeleteOperations,
  createJsonData,
};
