import { Request } from 'express';
import { IUser } from 'models/User';

export interface ISignupRequest extends Request {
  body: Pick<
    IUser,
    'name' | 'surname' | 'email' | 'role' | 'password' | 'passwordConfirm'
  >;
}
export interface ILoginRequest extends Request {
  body: Pick<IUser, 'email' | 'password'>;
}
