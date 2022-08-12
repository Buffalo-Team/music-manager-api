import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import useRouters from 'middlewares/useRouters';
import exitWithError from 'utils/exitWithError';
import morgan from 'morgan';

const xss = require('xss-clean');

dotenv.config({ path: '.env' });

const server: Application = express();
server.use(morgan('dev'));

const HEROKU: boolean = process.env.HEROKU === 'true';
const CLIENT_PORT: string = process.env.CLIENT_PORT ?? '';
const DATABASE_URI: string = process.env.DATABASE_URI ?? '';
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8000;

if (!HEROKU) {
  if (!CLIENT_PORT) {
    exitWithError('Missing CLIENT_PORT environment variable!');
  }

  server.use(
    cors({
      origin: `http://localhost:${CLIENT_PORT}`,
      credentials: true,
    })
  );
}

if (!DATABASE_URI) {
  exitWithError('Missing DATABASE_URI environment variable!');
}

mongoose.connect(DATABASE_URI).then(() => {
  console.log('DB connection successful');
});

server.use(express.json({ limit: '10kb' }));
server.use(cookieParser());
server.use(mongoSanitize());
//
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
