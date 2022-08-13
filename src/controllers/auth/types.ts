import { Request } from 'express';
import { IUser } from 'models/user';

export interface ISignupRequest extends Request {
  body: Pick<
    IUser,
    'name' | 'surname' | 'passwordConfirm' | 'email' | 'password'
  >;
}
export interface ILoginRequest extends Request {
  body: Pick<IUser, 'email' | 'password'>;
}
