import { Request as ExpressRequest } from 'express';
import { IUser } from 'models/user';

export default interface IRequest extends ExpressRequest {
  user?: IUser;
}
