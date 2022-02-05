import { NextFunction, Request, Response } from 'express';
import uploadService from '@services/upload.service';
import transactionService from '@services/transaction.service';
import Formidable from 'formidable';
import { HttpException } from '@/exceptions/HttpException';

class IndexController {
  public uploadService = new uploadService();
  public transactionService = new transactionService();
  public test = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public upload = async (req: any, res: Response, next: NextFunction) => {
    try {
      const form = Formidable();
      const { type } = req.query;

      form.parse(req, async (err, _, files) => {
        if (err) {
          throw new HttpException(400, err);
        }
        const file = files.file as Formidable.File;
        const fileName = `Image_${new Date().getTime()}`;
        try {
          const response = await this.uploadService.uploadFile(file.filepath, { destination: type as string, fileName });
          res.status(200).json({ data: response, message: 'upload success' });
        } catch (error) {
          console.log(error);
          res.status(400).json({ data: error, message: 'upload success' });
        }
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public stats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { totalEvents, investedAmount, investors } = await this.transactionService.getAppStats();
      res.status(200).json({ data: { totalEvents, investedAmount: investedAmount, investors }, message: 'app stats' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
