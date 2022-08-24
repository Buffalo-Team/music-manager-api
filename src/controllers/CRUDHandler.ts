import { Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { Status } from 'consts/enums';

interface IModelMethods {
  mapToDTO(): any;
}

interface IProps {
  Object: Model<any>;
  dataKey: string;
  select?: string;
  filter?: FilterQuery<any>;
  req: Request;
  res: Response;
}

export const generateGetAllObjectsCallback = async ({
  Object,
  dataKey,
  select,
  filter,
  res,
}: IProps) => {
  const objects: IModelMethods[] = await Object.find(filter || {}).select(
    select
  );

  res.status(200).json({
    status: Status.SUCCESS,
    [dataKey]: objects,
  });
};

export const generateGetOneObjectCallback = async ({
  Object,
  dataKey,
  select,
  req,
  res,
}: IProps) => {
  const object: IModelMethods = await Object.findById(req.params.id).select(
    select
  );

  res.status(200).json({
    status: Status.SUCCESS,
    [dataKey]: object,
  });
};

export const generateCreateObjectCallback = async ({
  Object,
  dataKey,
  req,
  res,
}: IProps) => {
  const object: IModelMethods = await Object.create(req.body);

  res.status(201).json({
    status: Status.SUCCESS,
    [dataKey]: object.mapToDTO(),
  });
};

export const generateUpdateObjectCallback = async ({
  Object,
  dataKey,
  select,
  req,
  res,
}: IProps) => {
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
};

export const generateDeleteObjectCallback = async ({
  Object,
  req,
  res,
}: Omit<IProps, 'dataKey'>) => {
  await Object.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: Status.SUCCESS,
  });
};
