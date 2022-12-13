export interface IUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  password: string;
}

export interface ICompany {
  name: string;
  emailDomain: string;
}

export interface IEvent {
  title: string;
  description: string;
  content: string;
  eventDate: Date;
}