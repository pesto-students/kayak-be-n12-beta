import { model, Schema, Document } from 'mongoose';
import { Currency, Transaction } from '@interfaces/transaction.interface';

const transactionSchema: Schema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  transactionId: {
    type: String,
    required: false,
  },
  eventId: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
    default: '',
  },
  amount: {
    type: String,
    required: false,
    default: '',
  },
  currency: {
    type: Currency,
    required: false,
    default: '',
  },
  pGResponse: {
    type: Object,
    required: false,
    default: {},
  },
});

const transactionModel = model<Transaction & Document>('Transaction', transactionSchema);

export default transactionModel;
