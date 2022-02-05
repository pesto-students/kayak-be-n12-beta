import { CreateEventDto } from '@/dtos/event.dto';
import { HttpException } from '@/exceptions/HttpException';
import { substractDaysFromDate } from '@/utils/date';
import { logger } from '@/utils/logger';
import { Event } from '@interfaces/events.interface';
import eventModel from '@models/events.model';
import { isEmpty } from 'class-validator';

class EventService {
  public events = eventModel;

  public async findEvents(type: string, page?: string, limit?: string): Promise<{ events: Event[]; count: number }> {
    let events: Event[] = [];
    switch (type) {
      case 'past': {
        const today = new Date();
        const previousDay = substractDaysFromDate(today, 30).getTime();
        events = await this.events.find({ startDateTimestamp: { $lt: previousDay } });
        break;
      }
      case 'ongoing': {
        const today = new Date();
        const previousDay = substractDaysFromDate(today, 30).getTime();
        events = await this.events.find({ startDateTimestamp: { $gt: previousDay, $lte: today.getTime() } });
        break;
      }
      case 'upcoming': {
        const today = new Date().getTime();
        events = await this.events.find({ startDateTimestamp: { $gt: today } });
        break;
      }
      case 'trending': {
        events = await this.events.find().sort({ viewCount: -1 }).exec();
        break;
      }
      case 'featured': {
        events = events = await this.events.find().sort({ totalFunding: -1 }).exec();
        break;
      }
      default:
        events = await this.events.find();
    }
    if (page && limit) {
      const offset = parseInt(page as string) - 1;
      const limitInt = parseInt(limit as string);
      const paginatedEvents = events.slice(offset, limitInt);
      return { events: paginatedEvents, count: events.length };
    }
    return { events, count: events.length };
  }

  public async getUserEvents(userId: string, page: string, limit: string): Promise<{ events: Event[]; count: number }> {
    let events: Event[] = [];
    events = await this.events.find({ creatorId: userId });
    if (page && limit) {
      const offset = parseInt(page as string) - 1;
      const limitInt = parseInt(limit as string);
      const paginatedEvents = events.slice(offset, limitInt);
      return { events: paginatedEvents, count: events.length };
    }
    return { events, count: events.length };
  }

  public async createEvent(eventData: CreateEventDto): Promise<Event> {
    if (isEmpty(eventData)) throw new HttpException(400, 'Bad Request');
    const startDateTimestamp = new Date(eventData.startDate).getTime();
    const pitchDateTimestamp = new Date(eventData.pitchDate).getTime();
    const createEventData: Event = await this.events.create({ ...eventData, startDateTimestamp, pitchDateTimestamp });

    return createEventData;
  }

  public async editEvent(eventData: any, eventId: string): Promise<Event> {
    if (isEmpty(eventData)) throw new HttpException(400, 'Bad Request');
    let event = { ...eventData };
    if (eventData.startDate) {
      const startDateTimestamp = new Date(eventData.startDate).getTime();
      event = { ...eventData, startDateTimestamp };
    }

    if (event.pitchDate) {
      const pitchDateTimestamp = new Date(eventData.pitchDate).getTime();
      event = { ...eventData, pitchDateTimestamp };
    }

    const editEventData: Event = await this.events.findByIdAndUpdate(eventId, event, { new: true });

    return editEventData;
  }

  public async subscribeEvent(eventId: string, userId: string): Promise<Event> {
    if (isEmpty(eventId)) throw new HttpException(400, 'Bad Request');

    const event: Event = await this.events.findOne({ _id: eventId });

    if (!event) throw new HttpException(409, 'No Event Found');

    if (event.subscribers.includes(userId)) throw new HttpException(409, 'Already Subscribed');

    const eventBody = { subscribers: [...event.subscribers, userId] };

    const subscribeEventData: Event = await this.events.findByIdAndUpdate(eventId, eventBody, { new: true });

    return subscribeEventData;
  }

  public async findEventById(eventId: string): Promise<Event> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No events found');

    const event: Event = await this.events.findOne({ _id: eventId });

    if (!event) throw new HttpException(409, 'No Event Found');
    const updatedEvent = await this.events.findByIdAndUpdate(eventId, { viewCount: event.viewCount + 1 }, { new: true });

    return updatedEvent;
  }

  public async updateFundingAmount(eventId: string, fundingAmount: number): Promise<void> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No events found');

    try {
      const event: Event = await this.events.findOne({ _id: eventId });

      await this.events.findByIdAndUpdate(eventId, { totalFunding: event.totalFunding + fundingAmount });
    } catch (error) {
      logger.error('Error in updateFundingAmount service', { error });
    }
  }

  public async searchEvents(query: string, page: string, limit: string): Promise<{ events: Event[]; count: number }> {
    if (isEmpty(query)) throw new HttpException(400, 'No events found');

    const events: Event[] = await this.events.find({ name: { $regex: query, $options: 'i' } });

    if (page && limit) {
      const offset = parseInt(page as string) - 1;
      const limitInt = parseInt(limit as string);
      const paginatedEvents = events.slice(offset, limitInt);
      return { events: paginatedEvents, count: events.length };
    }

    return { events, count: events.length };
  }
}

export default EventService;
