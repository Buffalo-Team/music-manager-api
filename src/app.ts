import express, { Application } from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import useRouters from 'middlewares/useRouters';
import morgan from 'morgan';
import notFound from 'middlewares/notFound';

const xss = require('xss-clean');

dotenv.config({ path: '.env' });

const server: Application = express();
server.use(morgan('dev'));

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8000;

server.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log('DB connection successful');
});

server.use(express.json({ limit: '10kb' }));
server.use(cookieParser());
server.use(mongoSanitize());
server.use(xss());

useRouters(server);

server.all('*', notFound);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
