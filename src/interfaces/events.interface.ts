export interface Event {
  _id: string;
  name: string;
  description: string;
  category: string;
  expectedFunding: number;
  totalFunding?: number;
  location: string;
  meetingURL: string;
  meetingPassword?: string;
  pitchDate: string;
  pitchDateTimestamp: number;
  startDate: string;
  startDateTimestamp: number;
  detailedInformation: string;
  highlightingImageVideoURL: string;
  status: Status;
  creatorId: string;
  creatorName: string;
  isEventPublished: Boolean;
  subscribers: string[];
  backers: string[];
  viewCount: number;
}

export enum Status {}
