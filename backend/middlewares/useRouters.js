const userRouter = require('../routes/userRouter');
const deviceRouter = require('../routes/deviceRouter');
const fileRouter = require('../routes/fileRouter');

module.exports = (server) => {
  server.use(`${process.env.API_PREFIX}/users`, userRouter);
  server.use(`${process.env.API_PREFIX}/devices`, deviceRouter);
  server.use(`${process.env.API_PREFIX}/files`, fileRouter);
};
