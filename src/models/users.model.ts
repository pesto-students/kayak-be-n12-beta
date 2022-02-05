import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: false,
    default: '',
  },
  street: {
    type: String,
    required: false,
    default: '',
  },
  city: {
    type: String,
    required: false,
    default: '',
  },
  zipCode: {
    type: String,
    required: false,
    default: '',
  },
  country: {
    type: String,
    required: false,
    default: '',
  },
  company: {
    type: String,
    required: false,
    default: '',
  },
  companyType: {
    type: String,
    required: false,
    default: '',
  },
  pan: {
    type: String,
    required: false,
    default: '',
  },
  type: {
    type: String,
    required: true,
    default: 'email',
  },
  portfolio: {
    type: Array,
    required: false,
    default: [],
  },
  events: {
    type: Array,
    required: false,
    default: [],
  },
  picture: {
    type: String,
    required: false,
    default: '',
  },
  googleId: {
    type: String,
    required: false,
    default: null,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
