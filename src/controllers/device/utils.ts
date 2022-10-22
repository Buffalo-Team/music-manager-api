import { filter, findIndex, forEach, map } from 'lodash';
import { format } from 'date-fns';
import { OperationType } from 'consts/enums';
import { IPopulatedOperation, IOperation } from 'models/Operation/types';

const isOperationPresent = (
  operations: IOperation[],
  operationType: OperationType
) =>
  findIndex(operations, (operation) => operation.type === operationType) >= 0;

const removeOperationsOnFile = (operations: IOperation[], fileId: string) =>
  operations.filter((operation) => operation.file.toString() !== fileId);

const generateFilename = (deviceName: string) => {
  const dateString = format(new Date(), 'dd-MM-yyyy-HHmm');
  return `music-${deviceName}-${dateString}.zip`;
};

const PATH_DELIMITER = '/';
const ROOT_PATH = '/';

const removeUserIdFromPath = (path: string) =>
  path.split(PATH_DELIMITER).slice(1).join(PATH_DELIMITER);

const removeLastPartOfPath = (path: string) =>
  path.split(PATH_DELIMITER).slice(0, -1).join(PATH_DELIMITER);

const createJsonData = (operations: IPopulatedOperation[]): string =>
  JSON.stringify({
    operations: operations.map((operation) => {
      let path =
        operation.type === OperationType.ADD
          ? operation.payload.newLocation
          : operation.payload.oldLocation;

      path = removeUserIdFromPath(path);
      if (operation.type === OperationType.ADD) {
        // Removes song name for file / slash at the end of folder
        path = removeLastPartOfPath(path);
      }

      return {
        type: operation.type,
        path: path || ROOT_PATH,
        fileName: operation?.file?.name,
        isFolder: operation?.file?.isFolder,
      };
    }),
  });

interface IGroupedOperations {
  [key: string]: IOperation[];
}

const simplifyAddDeleteOperations = async (
  operations: IOperation[],
  operationsGroupedByFileId: IGroupedOperations
): Promise<IOperation[]> => {
  // Simplify the operation list for each file
  let simplifiedOperations = [...operations];
  forEach(
    operationsGroupedByFileId,
    (currentFileOperations: IOperation[], fileId: string) => {
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
          fileId
        );
      }
    }
  );

  await Promise.all(
    map(simplifiedOperations, (o) => o.populate && o.populate('file'))
  );

  simplifiedOperations = filter(
    simplifiedOperations,
    ({ type, file }) => !(type === OperationType.ADD && !file)
  );

  await Promise.all(
    map(simplifiedOperations, (o) => o.depopulate && o.depopulate('file'))
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
