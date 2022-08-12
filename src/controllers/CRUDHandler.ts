import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { Status } from 'consts/enums';
import catchAsync from 'utils/catchAsync';

export const generateGetAllObjectsCallback = (
  Object: Model<any>,
  dataKey: string
) =>
  catchAsync(async (req: Request, res: Response) => {
    const objects = await Object.find();

    res.status(200).json({
      status: Status.SUCCESS,
      [dataKey]: objects,
    });
  });

export const generateGetOneObjectCallback = (
  Object: Model<any>,
  dataKey: string
) =>
  catchAsync(async (req: Request, res: Response) => {
    const object = await Object.findById(req.params.id);

    res.status(200).json({
      status: Status.SUCCESS,
      [dataKey]: object,
    });
  });

export const generateCreateObjectCallback = (
  Object: Model<any>,
  dataKey: string
) =>
  catchAsync(async (req: Request, res: Response) => {
    const object = await Object.create(req.body);

    res.status(201).json({
      status: Status.SUCCESS,
      [dataKey]: object,
    });
  });

export const generateUpdateObjectCallback = (
  Object: Model<any>,
  dataKey: string
) =>
  catchAsync(async (req: Request, res: Response) => {
    const object = await Object.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: Status.SUCCESS,
      [dataKey]: object,
    });
  });

export const generateDeleteObjectCallback = (Object: Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    await Object.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: Status.SUCCESS,
    });
  });
