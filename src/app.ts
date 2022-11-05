import express, { Application } from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongoose from 'mongoose';
import morgan from 'morgan';

import useRouters from 'middlewares/useRouters';
import notFound from 'middlewares/notFound';
import errorHandler from 'middlewares/errorHandler';
import generateExeFileAndUploadToS3 from 'utils/generateExeFileAndUploadToS3';
import { Environment } from 'consts/enums';

const xss = require('xss-clean');

const server: Application = express();
server.use(morgan('dev'));

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8000;

server.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
console.log('Deploy! Deploy!');
mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log('DB connection successful');
});

if (process.env.NODE_ENV === Environment.production) {
  generateExeFileAndUploadToS3().then(() => {
    console.log('EXE file uploaded to S3');
  });
}

server.use(express.json({ limit: '10kb' }));
server.use(cookieParser());
server.use(mongoSanitize());
server.use(xss());

useRouters(server);

server.all('*', notFound);
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
