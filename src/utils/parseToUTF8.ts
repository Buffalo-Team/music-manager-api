// Taken from https://github.com/expressjs/multer/issues/1104#issuecomment-1152987772
// TODO Maybe this PR will fix the multer issue: https://github.com/expressjs/multer/pull/1210

export default (name: string): string =>
  Buffer.from(name, 'latin1').toString('utf8');
