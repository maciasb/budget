import dayjs, { Dayjs } from "dayjs";
import { EXPENSE_TYPE_ENUM, FREQUENCY_ENUM } from "../data/enums";
import { EventEntity } from "../models/event";

export const FormatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {style: 'currency', currency: 'USD' })
}
export const GetAmount = (expenseType: EXPENSE_TYPE_ENUM, amount: number): number => {
  const sanitizedAmount = expenseType === EXPENSE_TYPE_ENUM.EXPENSE ? -amount: amount;
  return parseFloat(Number(sanitizedAmount).toFixed(2));
}; 

export function GetFirstOccurrence(event: EventEntity, fromDate: Dayjs): Dayjs {
  const currentDate = dayjs(fromDate);
  let newDate;
  switch (event.frequency) {
    case FREQUENCY_ENUM.MONTHLY:
      newDate = currentDate
        .add(fromDate.get('date') > event.dayOfMonth ? 1 : 0, 'month')
        .set('date', event.dayOfMonth);
      break;
    case FREQUENCY_ENUM.BI_WEEKLY: {
      const weeks = currentDate.diff(dayjs(event.startDate), 'week', true)
      newDate = currentDate.add(Math.ceil(weeks), 'week');
      break;
    }
    case FREQUENCY_ENUM.WEEKLY: {
      const weeks = currentDate.diff(dayjs(event.startDate), 'week', true)
      newDate = currentDate.add(Math.ceil(weeks), 'week');
      break;
    }
    case FREQUENCY_ENUM.TWICE_MONTHLY: {
      if (currentDate.get('date') < 15) {
        newDate = currentDate.set('date', 15);
      } else {
        newDate = currentDate.set('date', currentDate.endOf('month').get('date')).startOf('date');
      }
      break;
    }
    case FREQUENCY_ENUM.YEARLY: {
      if (dayjs(event.startDate).isAfter(currentDate)) {
        newDate = dayjs(event.startDate);
      } else {
        newDate = currentDate.month(dayjs(event.startDate).month()).day(event.dayOfMonth);
      }
      break;
    }
    default: {
      newDate = currentDate;
      break;
    }
  }
  return newDate;
}

export function GetNextOccurrence(event: EventEntity, mostRecentOccurrence: Dayjs): Dayjs {
  const currentDate = dayjs(mostRecentOccurrence).startOf('date');
  let newDate;
  switch (event.frequency) {
    case FREQUENCY_ENUM.MONTHLY:
      newDate = currentDate.add(1, 'month');
      break;
    case FREQUENCY_ENUM.WEEKLY: {
      newDate = currentDate.add(1, 'week')
      break;
    }
    case FREQUENCY_ENUM.BI_WEEKLY: {
      newDate = currentDate.add(2, 'week')
      break;
    }
    case FREQUENCY_ENUM.TWICE_MONTHLY: {      
      if (currentDate.get('date') !== 15) {
        newDate = currentDate.add(1, 'month').set('date', 15);
      } else {
        newDate = currentDate.endOf('month').startOf('date');
      }
      break;
    }
    case FREQUENCY_ENUM.YEARLY: {      
      newDate = currentDate.add(1, 'year')
      break;
    }
    default: {
      newDate = currentDate;
      break;
    }
  }
  return newDate;
}