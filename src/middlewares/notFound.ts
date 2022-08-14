import { Status } from 'consts/enums';
import { Response } from 'express';
import IRequest from 'types/Request';

export default (req: IRequest, res: Response) => {
  res.status(404).json({
    status: Status.NOT_FOUND,
  });
};
