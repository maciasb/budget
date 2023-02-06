import express from 'express';
import { Request, Response} from 'express';
import { EventEntity } from "../../models/event";
import { AppDataSource } from "../../services/data-source";

const router = express.Router();

router.get('/events', async (_req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const events = await eventsRepo.find({ order: { name: 'ASC' }});

  res.send(events);
});

router.get('/event/:id', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const event = await eventsRepo.findBy({ id: Number(req.params.id) });

  res.send(event);
});

router.post('/event', async (req: Request, res: Response) => {
  const event = new EventEntity();  

  // const eventRepository = AppDataSource.getRepository(EventEntity);
  // await eventRepository.save(event);

  res.send(event);
});

export default router;
