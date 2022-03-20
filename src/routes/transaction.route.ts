import { Router } from 'express';
import TransactionController from '@controllers/transaction.controller';
import { Routes } from '@interfaces/routes.interface';
import verifyMiddleware from '@/middlewares/verify.middleware';

class TransactionRoute implements Routes {
  public path = '/api/v1';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/orders/create`, this.transactionController.createOrder);
    this.router.post(`${this.path}/payment-success`, this.transactionController.paymentSuccess);
    this.router.post(`${this.path}/payment-failed`, this.transactionController.paymentFailed);
  }
}

export default TransactionRoute;
