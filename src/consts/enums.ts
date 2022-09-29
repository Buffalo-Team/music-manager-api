enum DeviceType {
  CAR = 'CAR',
  MOBILE = 'MOBILE',
  COMPUTER = 'COMPUTER',
  WATCH = 'WATCH',
}

enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

enum Environment {
  development = 'development',
  production = 'production',
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

enum OperationType {
  ADD = 'ADD',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  RENAME = 'RENAME',
}

export { DeviceType, Status, Environment, Role, OperationType };
