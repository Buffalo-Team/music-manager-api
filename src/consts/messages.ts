export default {
  missingEmailOrPassword: 'Provide email and password in order to log in',
  invalidEmailOrPassword: 'Email or password is invalid',
  sessionExpired: 'Your session has expired',
  loginToAccess: 'Log in to get access',
  fieldIsTaken: (fieldName: string) => `This ${fieldName} is already taken`,
  invalidPathValue: (path: string, value: string) =>
    `Invalid ${path}: ${value}.`,
  validationFailed: 'Validation failed for the submitted data',
  requestedDataNotFound: 'Requested data not found',
  missingSomeFields: (fields: string[]) =>
    `Missing at least one of the required fields: ${fields.join(', ')}`,
  directoryNotExist: 'Requested directory does not exist',
  fileNotExist: 'Requested file does not exist',
  someFilesAlreadyExisted: 'Some of the uploaded files have already existed',
  wrongFileType: 'Some of the uploaded files had wrong format',
  permissionDenied: 'Permission denied',
  deviceNotFound: 'The device was not found',
  convertingStreamFailed: 'Converting stream failed',
};
