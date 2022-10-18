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

export {
  isOperationPresent,
  removeOperationsOnFile,
  generateFilename,
  createJsonData,
};
