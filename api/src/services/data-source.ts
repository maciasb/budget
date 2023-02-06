import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { AccountEntity } from "../models/account";
import { EventEntity } from "../models/event";

const entities: any[] = [
  AccountEntity,
  EventEntity,
];

const {
  DB_PORT,
  DB_USERNAME,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD
} = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: String(DB_PASSWORD),
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities,
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
})
