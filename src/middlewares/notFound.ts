import { Request, Response } from 'express';
import { Status } from 'consts/enums';

export default (req: Request, res: Response) => {
  res.status(404).json({
    status: Status.NOT_FOUND,
  });
};
