import { Event } from './events.interface';
import { Transaction } from './transaction.interface';

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  contactNumber?: string;
  street?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  company?: string;
  companyType?: string;
  pan?: string;
  portfolio?: Array<any>;
  events?: Array<any>;
  googleId?: string;
  picture?: string;
  type?: string;
  verified?: true;
  __v?: number;
}

export interface Password {
  password: string;
  confirmPassword: string;
}

export interface Portfolio {
  event: Event;
  transaction: Transaction;
}
