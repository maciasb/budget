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

router.get('/events/:id', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  const event = await eventsRepo.findBy({ id: Number(req.params.id) });

  res.send(event);
});

router.delete('/events/:eventId', async (req: Request, res: Response) => {
  const eventsRepo = AppDataSource.getRepository(EventEntity)
  await eventsRepo.delete({ id: Number(req.params.eventId) });
  res.send({});
});

router.post('/events', async (req: Request, res: Response) => {
  const eventRepository = AppDataSource.getRepository(EventEntity);
  const event = await eventRepository.save({
    ...req.body
  });

  res.send(event);
});

export default router;
