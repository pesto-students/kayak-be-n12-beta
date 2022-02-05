import { NextFunction, Request, Response } from 'express';
import transactionService from '@services/transaction.service';
import { getUserInfoFromToken } from '@/utils/util';

class TransactionController {
  public transactionService = new transactionService();
  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentPayload = req.body;
      const { userId } = await getUserInfoFromToken(req);
      const response = await this.transactionService.createOrder(paymentPayload, userId);
      res.status(200).json({ data: response, message: 'order created' });
    } catch (error) {
      next(error);
    }
  };

  public paymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const successResponse = req.body?.payload?.payment?.entity;
      this.transactionService.paymentSuccess(successResponse);
      res.status(200).json({ data: 'ok', message: 'payment success' });
    } catch (error) {
      next(error);
    }
  };

  public paymentFailed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const failureResponse = req.body?.payload?.payment?.entity;
      this.transactionService.paymentFailed(failureResponse);
      res.status(200).json({ data: 'ok', message: 'payment failed' });
    } catch (error) {
      next(error);
    }
  };

  public getTotalInvestment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = await getUserInfoFromToken(req);
      const { totalInvestment, investmentCount } = await this.transactionService.getTotalInvestment(userId);
      res.status(200).json({ data: { totalInvestment, investmentCount }, message: 'success' });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
