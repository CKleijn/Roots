import { Types } from 'mongoose';

//INTERFACES
export interface IUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  password: string;
  isActive: boolean;
  organization: Types.ObjectId;
}

export interface IOrganization {
  name: string;
  emailDomain: string;
  events: Types.ObjectId[];
  logs: ILog[];
}

export interface IEvent {
  title: string;
  description: string;
  content: string;
  eventDate: Date;
  isActive: boolean;
}

export interface ITag {
  name: string;
}

export interface IToken {
  type: string;
  expirationDate: Date;
}


export interface ILog{
  editor: string;
  action: string;
  object: string;
  logStamp: Date;
}

export interface UserData {
  initials:string;
  firstname:string;
  lastname:string;
  emailAddress:string;
  createdAt:Date;
  lastLoginTimestamp: Date;
  isActive: boolean;
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
  initials = '';
  isActive = true;
  isVerified = true;
}

export class Organization implements IOrganization {
  _id = new Types.ObjectId();
  name = '';
  emailDomain = '';
  events = [] as Types.ObjectId[];
  tags = [] as Types.ObjectId[];
  logs = [] as ILog[]
}

export class Event implements IEvent {
  title = '';
  description = '';
  content = '';
  eventDate = new Date();
  _id = new Types.ObjectId();
  tags = [] as Types.ObjectId[];
  isActive = true;
}

export class Tag implements ITag {
  _id = new Types.ObjectId();
  name = '';
  organization = new Types.ObjectId();
}


export class Log implements ILog {
  editor = '';
  action = '';
  object = '';
  logStamp = new Date();
}