import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import EventsService from '@services/events.service';
import TransactionService from '@services/transaction.service';
import { getUserInfoFromToken } from '@/utils/util';

class UsersController {
  private userService = new userService();
  private eventsService = new EventsService();
  private transactionService = new TransactionService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      findOneUserData.password = undefined;
      findOneUserData.__v = undefined;

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getUserEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const { userId } = await getUserInfoFromToken(req);
      const { events, count } = await this.eventsService.getUserEvents(userId, page as string, limit as string);
      res.status(200).json({ count, data: events, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const { userId } = await getUserInfoFromToken(req);
      const { portfolio, count } = await this.transactionService.getPortfolio(userId, page as string, limit as string);
      res.status(200).json({ count, data: portfolio, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      createUserData.password = undefined;
      createUserData.__v = undefined;
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      updateUserData.password = undefined;
      updateUserData.__v = undefined;
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);
      deleteUserData.password = undefined;
      deleteUserData.__v = undefined;
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
