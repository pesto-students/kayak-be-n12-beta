import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/api/v1/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/user-events`, authMiddleware, this.usersController.getUserEvents);
    this.router.get(`${this.path}/portfolio`, authMiddleware, this.usersController.getPortfolio);
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.post(`${this.path}`, authMiddleware, this.usersController.createUser);
    this.router.patch(`${this.path}/:id`, authMiddleware, this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser);
  }
}

export default UsersRoute;
