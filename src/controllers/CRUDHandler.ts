import { Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { assign } from 'lodash';
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
  filter,
  req,
  res,
}: IProps) => {
  const query = assign({ _id: req.params.id }, filter);

  const object: IModelMethods = await Object.findOne(query).select(select);

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
  filter,
  req,
  res,
}: IProps) => {
  const query = assign({ _id: req.params.id }, filter);

  const object: IModelMethods = await Object.findOneAndUpdate(query, req.body, {
    new: true,
    runValidators: true,
  }).select(select);

  res.status(201).json({
    status: Status.SUCCESS,
    [dataKey]: object,
  });
};

export const generateDeleteObjectCallback = async ({
  Object,
  filter,
  req,
  res,
}: Omit<IProps, 'dataKey'>) => {
  const query = assign({ _id: req.params.id }, filter);
  await Object.findOneAndDelete(query);

  res.status(204).json({
    status: Status.SUCCESS,
  });
};
