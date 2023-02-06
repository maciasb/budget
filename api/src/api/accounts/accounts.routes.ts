import express from 'express';
import { Request, Response} from 'express';
import { AccountEntity } from "../../models/account";
import { AppDataSource } from "../../services/data-source";

const router = express.Router();

router.get('/accounts', async (req: Request, res: Response) => {
  const accountsRepo = AppDataSource.getRepository(AccountEntity)
  const accounts = await accountsRepo.find();

  res.send(accounts);
});

export default router;