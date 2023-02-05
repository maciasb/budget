import { DataSource } from "typeorm";
import { EventEntity } from "./entity/event";

const entities: any[] = [
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
  username: "postgres",
  password: String("1001"),
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities,
  subscribers: [],
  migrations: [],
})
