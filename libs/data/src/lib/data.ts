import { Types } from 'mongoose';

//INTERFACES
export interface IUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  password: string;
}

export interface ICompany {
  name: string;
  emailDomain: string;
  events:IEvent[];
}

// CLASSES
export class User implements IUser {
  _id = new Types.ObjectId();
  firstname = '';
  lastname = '';
  emailAddress = '';
  password = '';
  access_token = '';
}