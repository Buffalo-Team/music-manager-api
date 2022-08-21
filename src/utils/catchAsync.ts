import { NextFunction, Request, Response } from 'express';

type TFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (fn: TFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
