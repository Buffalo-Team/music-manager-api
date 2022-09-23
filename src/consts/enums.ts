enum DeviceType {
  CAR = 'CAR',
  MOBILE = 'MOBILE',
  LAPTOP = 'LAPTOP',
  PC = 'PC',
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

export { DeviceType, Status, Environment, Role };
