import { NextFunction, Response } from 'express';
import IRequest from 'types/Request';

type TFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (fn: TFunction) =>
  (req: IRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
