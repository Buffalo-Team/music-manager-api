import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import useRouters from 'middlewares/useRouters';
import morgan from 'morgan';

const xss = require('xss-clean');

dotenv.config({ path: '.env' });

const server: Application = express();
server.use(morgan('dev'));

const HEROKU: boolean = process.env.HEROKU === 'true';
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8000;

if (!HEROKU) {
  server.use(
    cors({
      origin: `http://localhost:${process.env.CLIENT_PORT}`,
      credentials: true,
    })
  );
}

mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log('DB connection successful');
});

server.use(express.json({ limit: '10kb' }));
server.use(cookieParser());
server.use(mongoSanitize());
server.use(xss());

// Serve static files
server.use(express.static(path.join(__dirname, '../frontend/build')));

useRouters(server);

// Redirect other requests to frontend
server.all('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/../frontend/build/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
