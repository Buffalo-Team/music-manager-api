const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const useRouters = require('./middlewares/useRouters');

// CONTROLLERS
// const globalErrorHandler = require('./controllers/errorController');

const server = express();

if (process.env.HEROKU !== 'true') {
  dotenv.config({ path: './.env' });

  server.use(
    cors({
      origin: `http://localhost:${process.env.CLIENT_PORT}`,
      credentials: true,
    })
  );
  server.options('*', cors());
}

const DB_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB_URI).then(() => {
  // eslint-disable-next-line no-console
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
server.all('*', (_, res, __) => {
  res.sendFile(path.join(__dirname, '/../frontend/build/index.html'));
});

// server.use(globalErrorHandler);

module.exports = server;
