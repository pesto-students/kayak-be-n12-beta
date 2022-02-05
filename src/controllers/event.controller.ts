import { NextFunction, Request, Response } from 'express';
import { CreateEventDto } from '@dtos/event.dto';
import { Event } from '@interfaces/events.interface';
import eventService from '@services/events.service';
import { getUserInfoFromToken } from '@/utils/util';

class EventsController {
  public eventsService = new eventService();

  public getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page, limit } = req.query;
      const { events, count } = await this.eventsService.findEvents(type as string, page as string, limit as string);
      res.status(200).json({ count, data: events, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public createEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, userName } = await getUserInfoFromToken(req);
      const eventData: CreateEventDto = { ...req.body, creatorId: userId, creatorName: userName };
      const createEventData: Event = await this.eventsService.createEvent(eventData);

      res.status(201).json({ data: createEventData, message: 'Event created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public editEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventData: any = req.body;
      const eventId: string = req.params.id;
      const editEventData: Event = await this.eventsService.editEvent(eventData, eventId);

      res.status(201).json({ data: editEventData, message: 'Event edited successfully' });
    } catch (error) {
      next(error);
    }
  };

  public subscribeEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = await getUserInfoFromToken(req);
      const eventId: string = req.params.eventId;
      const editEventData: Event = await this.eventsService.subscribeEvent(eventId, userId);

      res.status(201).json({ data: editEventData, message: 'Event edited successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId: string = req.params.id;
      const eventData: Event = await this.eventsService.findEventById(eventId);

      res.status(200).json({ data: eventData, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public searchEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      const query = req.query.q;
      const { events, count } = await this.eventsService.searchEvents(query as string, page as string, limit as string);

      res.status(200).json({ data: events, count, message: 'success' });
    } catch (error) {
      next(error);
    }
  };
}

export default EventsController;
