import { NextFunction, Response } from 'express';

type TFunction = (req: any, res: Response, next: NextFunction) => Promise<any>;

export default (fn: TFunction) =>
  (req: any, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
