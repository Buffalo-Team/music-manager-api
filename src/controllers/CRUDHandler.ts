import { Response } from 'express';
import { Model } from 'mongoose';
import { Status } from 'consts/enums';
import catchAsync from 'utils/catchAsync';
import IRequest from 'types/Request';

interface IModelMethods {
  mapToDTO(): any;
}

export const generateGetAllObjectsCallback = (
  Object: Model<any>,
  dataKey: string,
  select?: string
) =>
  catchAsync(async (req: IRequest, res: Response) => {
    const objects: IModelMethods[] = await Object.find().select(select);

    res.status(200).json({
      status: Status.SUCCESS,
      [dataKey]: objects,
    });
  });

export const generateGetOneObjectCallback = (
  Object: Model<any>,
  dataKey: string,
  select?: string
) =>
  catchAsync(async (req: IRequest, res: Response) => {
    const object: IModelMethods = await Object.findById(req.params.id).select(
      select
    );

    res.status(200).json({
      status: Status.SUCCESS,
      [dataKey]: object,
    });
  });

export const generateCreateObjectCallback = (
  Object: Model<any>,
  dataKey: string
) =>
  catchAsync(async (req: IRequest, res: Response) => {
    const object: IModelMethods = await Object.create(req.body);

    res.status(201).json({
      status: Status.SUCCESS,
      [dataKey]: object.mapToDTO(),
    });
  });

export const generateUpdateObjectCallback = (
  Object: Model<any>,
  dataKey: string,
  select?: string
) =>
  catchAsync(async (req: IRequest, res: Response) => {
    const object: IModelMethods = await Object.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select(select);

    res.status(201).json({
      status: Status.SUCCESS,
      [dataKey]: object,
    });
  });

export const generateDeleteObjectCallback = (Object: Model<any>) =>
  catchAsync(async (req: IRequest, res: Response) => {
    await Object.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: Status.SUCCESS,
    });
  });
