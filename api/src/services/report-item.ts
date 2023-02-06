import { Dayjs } from "dayjs";
import { FREQUENCY_ENUM } from "../data/enums";

export interface ReportItem {
  date: string,
  name: string,
  amount: string,
  runningTotal: string,
  nextOccurrence?: Dayjs,
  frequency: FREQUENCY_ENUM,
}