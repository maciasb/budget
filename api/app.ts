import dotenv from 'dotenv';
import path from 'path';
// Call before importing express
dotenv.config({ path: path.resolve(__dirname, '../config/local.env') });

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './src/services/data-source';
import allRoutes from './routes';

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

const router = express.Router();
router.use(allRoutes);

app.use(router);

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

app.listen(SERVER_PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${SERVER_PORT}`);
});

