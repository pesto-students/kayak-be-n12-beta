import { Router } from 'express';
import EventsController from '@controllers/event.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import verifyMiddleware from '@/middlewares/verify.middleware';

class EventsRoute implements Routes {
  public path = '/api/v1/events';
  public router = Router();
  public eventsController = new EventsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.eventsController.getEvents);
    this.router.get(`${this.path}/search`, this.eventsController.searchEvents);
    this.router.post(`${this.path}`, verifyMiddleware, this.eventsController.createEvents);
    this.router.get(`${this.path}/:id`, this.eventsController.getEventById);
    this.router.patch(`${this.path}/:id`, verifyMiddleware, this.eventsController.editEvents);
    this.router.patch(`${this.path}/subscribe/:eventId`, authMiddleware, this.eventsController.subscribeEvent);
  }
}

export default EventsRoute;
