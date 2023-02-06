import dayjs, { Dayjs } from 'dayjs';
import { Request, Response} from 'express';
import { EXPENSE_TYPE_ENUM, FREQUENCY_ENUM } from '../../data/enums';
import { AccountEntity } from '../../models/account';
import { EventEntity } from '../../models/event';
import { AppDataSource } from '../../services/data-source';
import { ReportItem } from '../../services/report-item';
import { FormatCurrency, GetAmount, GetFirstOccurrence, GetNextOccurrence } from '../../utils';

export const BuildReport = async (req: Request, res: Response) => {
    const accountsRepo = AppDataSource.getRepository(AccountEntity)
    const accounts = await accountsRepo.find();
  
    const eventsRepo = AppDataSource.getRepository(EventEntity)
    const events = await eventsRepo.find();
  
    const startDate = dayjs().startOf('date');
    const report: ReportItem[] = [];
  
    let runningTotal = 0;
  
    accounts.forEach((account) => {
      const amount = GetAmount(EXPENSE_TYPE_ENUM.BALANCE, account.startingBalance);
      runningTotal += amount;
      runningTotal = parseFloat(runningTotal.toFixed(2));
  
      report.push({
        date: startDate.format('M/D/YYYY'),
        name: account.name,
        amount: FormatCurrency(amount),
        runningTotal: FormatCurrency(runningTotal),
        frequency: FREQUENCY_ENUM.NONE,
      });
    });
  
    const eventsMatrix: EventEntity[] = [];
    const occurrences: Record<number, Dayjs> = {};
    const balances: Record<number, number> = {};
  
    events.forEach((event) => {
      const firstOccurrence = GetFirstOccurrence(event, startDate);
      occurrences[event.id] = firstOccurrence;
  
      if (event.balance > 0) {
        balances[event.id] = event.balance;
      }
  
      const newEvent: EventEntity = {
        ...event,
        nextOccurrence: firstOccurrence,
      }
      eventsMatrix.push(newEvent);
    });
  
    for (let x = 0; x < 360; x++) {
      const currentDate = dayjs().startOf('date').add(x, 'day');
      const eligibleEvents = eventsMatrix.filter((event) => {
        return currentDate.isSame(occurrences[event.id])
          && (!(event.id in balances) || balances[event.id] > 0);
      });
  
      eligibleEvents.forEach((event) => {
        let amount = event.amount;
  
        // Revolving accounts will be paid up to the open balance
        // before dropping off
        if (event.id in balances) {
          console.log(`${currentDate} ${event.id} ${balances[event.id]} ${amount} ${balances[event.id] < amount}`)
          if (Number(balances[event.id]) < amount) {
            console.log('partial');
            amount = balances[event.id];
            balances[event.id] = 0;
          } else {
            console.log('full');
            balances[event.id] = parseFloat((balances[event.id] - event.amount).toFixed(2))
          }
        }
  
        runningTotal += GetAmount(event.expenseType, amount);
        runningTotal = parseFloat(runningTotal.toFixed(2));
        const nextOccurrence = GetNextOccurrence(event, occurrences[event.id]);
        report.push({
          date: currentDate.format('M/D/YYYY'),
          name: `${event.name}${event.id in balances ? ' (balance: ' + balances[event.id] + ')' : ''}`,
          amount: GetAmount(event.expenseType, amount).toLocaleString('en-US', {style: 'currency', currency: 'USD' }),
          runningTotal: runningTotal.toLocaleString('en-US', {style: 'currency', currency: 'USD' }),
          nextOccurrence,
          frequency: event.frequency,
        });
        occurrences[event.id] = nextOccurrence;
      });
    }
  
    res.send(report);
}
