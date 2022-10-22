import { countBy, groupBy } from 'lodash';
import { OperationType } from 'consts/enums';
import { simplifyAddDeleteOperations } from 'controllers/device/utils';
import { IOperation } from 'models/Operation';

type ICountByType = {
  [key in OperationType]?: number;
};

const countOperationTypes = async (
  operations: IOperation[]
): Promise<ICountByType> => {
  const operationsGroupedByFileId = groupBy(
    operations,
    (operation) => operation.file
  );

  const simplifiedOperations = await simplifyAddDeleteOperations(
    operations,
    operationsGroupedByFileId
  );

  return countBy(simplifiedOperations, 'type');
};

export { countOperationTypes };
