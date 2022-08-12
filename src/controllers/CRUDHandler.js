const statuses = require('../consts/statuses');
const catchAsync = require('../utils/catchAsync');

exports.generateGetAllObjectsCallback = (Object, dataKey) =>
  catchAsync(async (_, res, __) => {
    const objects = await Object.find();

    res.status(200).json({
      status: statuses.SUCCESS,
      [dataKey]: objects,
    });
  });

exports.generateGetOneObjectCallback = (Object, dataKey) =>
  catchAsync(async (req, res, _) => {
    const object = await Object.findById(req.params.id);

    res.status(200).json({
      status: statuses.SUCCESS,
      [dataKey]: object,
    });
  });

exports.generateCreateObjectCallback = (Object, dataKey) =>
  catchAsync(async (req, res, _) => {
    const object = await Object.create(req.body);

    res.status(201).json({
      status: statuses.SUCCESS,
      [dataKey]: object,
    });
  });

exports.generateUpdateObjectCallback = (Object, dataKey) =>
  catchAsync(async (req, res, _) => {
    const object = await Object.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: statuses.SUCCESS,
      [dataKey]: object,
    });
  });

exports.generateDeleteObjectCallback = (Object) =>
  catchAsync(async (req, res, _) => {
    await Object.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: statuses.SUCCESS,
    });
  });
