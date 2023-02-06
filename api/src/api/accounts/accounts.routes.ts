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

router.post('/accounts', async (req: Request, res: Response) => {
  const accountsRepo = AppDataSource.getRepository(AccountEntity);
  const account = await accountsRepo.save({
    ...req.body
  });

  res.send(account);
});

router.delete('/accounts/:accountId', async (req: Request, res: Response) => {
  const accountsRepo = AppDataSource.getRepository(AccountEntity);
  await accountsRepo.delete({ id: Number(req.params.accountId) });
  res.send({});
});

export default router;