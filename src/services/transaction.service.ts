import { Transaction } from '@/interfaces/transaction.interface';
import { Portfolio } from '@/interfaces/users.interface';
import transactionModel from '@models/transaction.model';
import EventService from '@services/events.service';
import Razorpay from 'razorpay';
import shortid from 'shortid';

class TransactionService {
  public transaction = transactionModel;
  public eventService = new EventService();

  public async getPortfolio(userId: string, page: string, limit: string): Promise<{ portfolio: Portfolio[]; count: number }> {
    let portfolio: Portfolio[] = [];
    const transactions = await this.transaction.find({ userId });

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const event = await this.eventService.findEventById(transaction.eventId);
      portfolio = [...portfolio, { event, transaction }];
    }

    if (page && limit) {
      const offset = parseInt(page as string) - 1;
      const limitInt = parseInt(limit as string);
      const paginatedPortfolio = portfolio.slice(offset, limitInt);
      return { portfolio: paginatedPortfolio, count: portfolio.length };
    }
    return { portfolio, count: portfolio.length };
  }

  public async createOrder(paymentPayload: any, userId: string): Promise<any> {
    const paymentInstance = new Razorpay({
      key_id: process.env.RAZORPAY_CLIENT_ID,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const order = await paymentInstance.orders.create({
      amount: paymentPayload.amount * 100,
      currency: paymentPayload.currency,
      receipt: shortid(),
      payment_capture: true,
      notes: {
        eventId: paymentPayload.eventId,
      },
    });

    const transaction: Transaction = {
      orderId: order.id,
      status: 'pending',
      eventId: paymentPayload.eventId,
      userId,
      date: new Date(),
      amount: paymentPayload.amount,
      currency: paymentPayload.currency,
    };

    await this.transaction.create(transaction);

    return order;
  }

  public async paymentSuccess(successResponse: any): Promise<any> {
    const eventId: string = successResponse.notes.eventId;
    const amount: number = successResponse.amount / 100;
    await this.transaction.findOneAndUpdate(
      { orderId: successResponse.order_id },
      { transactionId: successResponse.id, status: 'success', pGResponse: successResponse },
    );

    await this.eventService.updateFundingAmount(eventId, amount);
  }

  public async paymentFailed(failureResponse: any): Promise<any> {
    await this.transaction.findOneAndUpdate(
      { orderId: failureResponse.order_id },
      { transactionId: failureResponse.id, status: 'failed', pGResponse: failureResponse },
    );
  }

  public async getTotalInvestment(userId: string): Promise<{ investmentCount: number; totalInvestment: number }> {
    let totalInvestment = 0;
    const transactions = await this.transaction.find({ userId, status: 'success' });

    transactions.forEach(transaction => (totalInvestment += parseInt(transaction.amount)));

    return { investmentCount: transactions.length, totalInvestment };
  }

  public async getAppStats(): Promise<{ investedAmount: number; totalEvents: number; investors: number }> {
    let investedAmount = 0;
    let totalEvents = 0;
    let investors = 0;

    const investorsSet = new Set();

    const transactions = await this.transaction.find({ status: 'success' });

    const { events } = await this.eventService.findEvents('all');

    for (const transaction of transactions) {
      investedAmount = investedAmount + parseInt(transaction.amount);
      investorsSet.add(transaction.userId);
    }

    totalEvents = events.length;

    investors = investorsSet.size;

    return { investedAmount, totalEvents, investors };
  }
}

export default TransactionService;
