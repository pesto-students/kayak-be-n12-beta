import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';
import verifyMiddleware from '@/middlewares/verify.middleware';

class IndexRoute implements Routes {
  public path = '/api/v1';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.test);
    this.router.post(`${this.path}/upload`, verifyMiddleware, this.indexController.upload);
    this.router.get(`${this.path}/stats`, this.indexController.stats);
  }
}

export default IndexRoute;
