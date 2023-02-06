import { Dayjs } from "dayjs";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { EXPENSE_TYPE_ENUM, FREQUENCY_ENUM } from "../data/enums";

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  amount: number

  @Column()
  startDate: Date;

  @Column()
  frequency: FREQUENCY_ENUM

  @Column()
  dayOfMonth: number;

  @Column()
  expenseType: EXPENSE_TYPE_ENUM

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
  balance: number;

  nextOccurrence: Dayjs
}