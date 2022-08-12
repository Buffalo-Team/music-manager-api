const server = require('./src/server');

const port = process.env.PORT || 8000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});
