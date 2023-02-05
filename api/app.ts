import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './src/data-source';
import { EventEntity } from './src/entity/event';
import { EXPENSE_TYPE_ENUM, FREQUENCY_ENUM } from './src/utils/enums';
import { GetAmount } from './src/utils';
import dayjs, { Dayjs } from 'dayjs';

dotenv.config();

const {
  SERVER_PORT,
} = process.env;

const allowlist = ['http://localhost:3000']
const corsOptionsDelegate = (req: Request, callback: any) => {
  const corsOptions: any = {};
  if (allowlist.indexOf(req.header('Origin') as string) !== -1) {
    corsOptions.origin = true;
  } else {
    corsOptions.origin = false;
  }
  callback(null, corsOptions)
}

AppDataSource.initialize()
    .then(() => {
        console.log('Successfully connected to database');
    })
    .catch((error) => console.log(error))

const app: Express = express();
app.use(cors(corsOptionsDelegate));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/events', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const events = await eventsRepo.find();

  res.send(events);
});

app.get('/event/:id', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const event = await eventsRepo.findBy({ id: Number(req.params.id) });

  res.send(event);
});

app.post('/event', async (req: Request, res: Response) => {
  const event = new EventEntity()
  event.name = "Me and Bears"
  event.amount = 2222

  const eventRepository = AppDataSource.getRepository(EventEntity)
  await eventRepository.save(event)

  console.log(event);
  res.send(event);
});

function getFirstOccurrence(event: EventEntity, fromDate: Dayjs): Dayjs {
  const currentDate = dayjs(fromDate);
  let newDate;
  switch (event.frequency) {
    case FREQUENCY_ENUM.MONTHLY:
      newDate = currentDate
        .add(fromDate.get('date') > event.dayOfMonth ? 1 : 0, 'month')
        .set('date', event.dayOfMonth);
      //console.log(`${event.frequency} ${event.name} ${currentDate} ${newDate}`);
      break;
    case FREQUENCY_ENUM.BI_WEEKLY: {
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
    default: {
      newDate = currentDate;
      break;
    }
  }
  return newDate;
}

function getNextOccurrence(event: EventEntity, mostRecentOccurrence: Dayjs): Dayjs {
  const currentDate = dayjs(mostRecentOccurrence).startOf('date');
  let newDate;
  switch (event.frequency) {
    case FREQUENCY_ENUM.MONTHLY:
      newDate = currentDate.add(1, 'month');
      //console.log(`${event.frequency} ${event.name} ${currentDate} ${newDate}`);
      break;
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
      //console.log(`${currentDate.get('date')} mas ${mostRecentOccurrence} ${newDate}`);
      break;
    }
    default: {
      newDate = currentDate;
      break;
    }
  }
  return newDate;
}

app.get('/budget', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const events = await eventsRepo.find();

  const startDate = dayjs().startOf('date');
  const budget: any = [];

  let runningTotal = 0;

  const eventsMatrix: EventEntity[] = [];
  const occurrences: Record<number, Dayjs> = {};

  events.forEach((event) => {
    const firstOccurrence = getFirstOccurrence(event, startDate);
    occurrences[event.id] = firstOccurrence;
    const newEvent: EventEntity = {
      ...event,
      nextOccurrence: firstOccurrence,
    }
    eventsMatrix.push(newEvent);
  });


  for (let x = 0; x < 360; x++) {
    const currentDate = dayjs().startOf('date').add(x, 'day');
    console.log(currentDate.toString());
    const eligibleEvents = eventsMatrix.filter((event) => {
      return currentDate.isSame(occurrences[event.id]);
    });

    for (let y = 0; y < eligibleEvents.length; y++) {
      runningTotal += GetAmount(eligibleEvents[y].expenseType, eligibleEvents[y].amount);
      runningTotal = parseFloat(runningTotal.toFixed(2));
      const nextOccurrence = getNextOccurrence(eligibleEvents[y], occurrences[eligibleEvents[y].id]);
      budget.push({
        date: currentDate.format('M/D/YYYY'),
        name: eligibleEvents[y].name,
        amount: GetAmount(eligibleEvents[y].expenseType, eligibleEvents[y].amount).toLocaleString('en-US', {style: 'currency', currency: 'USD' }),
        runningTotal: runningTotal.toLocaleString('en-US', {style: 'currency', currency: 'USD' }),
        nextOccurrence,
        frequency: eligibleEvents[y].frequency,
      });
      occurrences[eligibleEvents[y].id] = nextOccurrence;
    }
  }

  res.send(budget);
});

app.listen(SERVER_PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${SERVER_PORT}`);
});

