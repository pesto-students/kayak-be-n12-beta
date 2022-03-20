export interface Transaction {
  _id?: string;
  orderId: string;
  transactionId?: string;
  eventId: string;
  userId: string;
  status: string;
  date: Date;
  amount: string;
  currency: string;
  pGResponse?: any;
}

export enum Currency {
  INR,
  USD,
}
