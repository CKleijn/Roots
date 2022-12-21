import { Types } from 'mongoose';

//INTERFACES
export interface IUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  password: string;
  organization: Types.ObjectId;
}

export interface IOrganization {
  name: string;
  emailDomain: string;
  events: IEvent[];
}

export interface IEvent {
  title: string;
  description: string;
  content: string;
  eventDate: Date;
}

export interface ITag {
  name:string;
}

// CLASSES
export class User implements IUser {
  _id = new Types.ObjectId();
  firstname = '';
  lastname = '';
  emailAddress = '';
  password = '';
  access_token = '';
  organization = new Types.ObjectId();
}

export class Organization implements IOrganization {
  name = '';
  emailDomain = '';
  events = [];
}
