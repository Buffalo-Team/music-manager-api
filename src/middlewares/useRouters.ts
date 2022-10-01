import { Application } from 'express';
import fileRouter from 'routes/fileRouter';
import userRouter from 'routes/userRouter';
import deviceRouter from 'routes/deviceRouter';
import operationRouter from 'routes/operationRouter';
import adminRouter from 'routes/adminRouter';

export default (server: Application) => {
  server.use(`${process.env.API_PREFIX}/users`, userRouter);
  server.use(`${process.env.API_PREFIX}/devices`, deviceRouter);
  server.use(`${process.env.API_PREFIX}/files`, fileRouter);
  server.use(`${process.env.API_PREFIX}/operations`, operationRouter);
  server.use(`${process.env.API_PREFIX}/admin`, adminRouter);
};
