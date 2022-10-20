import { countBy, groupBy } from 'lodash';
import { OperationType } from 'consts/enums';
import { simplifyAddDeleteOperations } from 'controllers/device/utils';
import { IOperation } from 'models/Operation';

const countOperationTypes = (
  operations: IOperation[]
): { [key in OperationType]?: number } => {
  const operationsGroupedByFileId = groupBy(
    operations,
    (operation) => operation.file
  );

  const simplifiedOperations = simplifyAddDeleteOperations(
    operations,
    operationsGroupedByFileId,
    'file'
  ) as IOperation[];

  return countBy(simplifiedOperations, 'type');
};

export { countOperationTypes };
