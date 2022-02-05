import { model, Schema, Document } from 'mongoose';
import { Event, Status } from '@interfaces/events.interface';

const eventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: '',
  },
  expectedFunding: {
    type: Number,
    required: true,
  },
  totalFunding: {
    type: Number,
    required: false,
    default: 0,
  },
  location: {
    type: String,
    required: true,
    default: '',
  },
  meetingUrl: {
    type: String,
    required: true,
    default: '',
  },
  meetingPassword: {
    type: String,
    required: false,
    default: '',
  },
  pitchDate: {
    type: Date,
    required: true,
    default: '',
  },
  pitchDateTimestamp: {
    type: Number,
    required: true,
    default: '',
  },
  startDate: {
    type: Date,
    required: true,
    default: '',
  },
  startDateTimestamp: {
    type: Number,
    required: true,
    default: '',
  },
  detailedInformation: {
    type: String,
    required: true,
    default: '',
  },
  highlightingImageVideoURL: {
    type: String,
    required: true,
    default: '',
  },
  status: {
    type: Status,
    required: false,
    default: '',
  },
  creatorId: {
    type: String,
    required: true,
    default: '',
  },
  creatorName: {
    type: String,
    required: true,
    default: '',
  },
  isEventPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  subscribers: {
    type: Array,
    required: false,
    default: [],
  },
  backers: {
    type: Array,
    required: false,
    default: [],
  },
  viewCount: {
    type: Number,
    required: false,
    default: 0,
  },
});

const eventModel = model<Event & Document>('Event', eventSchema);

export default eventModel;
