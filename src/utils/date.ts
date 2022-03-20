import { sub } from 'date-fns';

export const substractDaysFromDate = (date: Date, days: number) => {
  return sub(date, { days });
};
