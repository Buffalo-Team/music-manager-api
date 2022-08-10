const userRouter = require('../routes/userRouter');

module.exports = (server) => {
  server.use(`${process.env.API_PREFIX}/users`, userRouter);
};
