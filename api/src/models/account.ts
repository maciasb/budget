import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  startingBalance: number
}