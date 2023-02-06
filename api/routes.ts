import express from 'express';
import { accountRoutes } from './src/api/accounts';
import { eventRoutes } from './src/api/events';
import { reportRoutes } from './src/api/report';

export const allRoutes = express.Router();

allRoutes.use(accountRoutes);
allRoutes.use(eventRoutes);
allRoutes.use(reportRoutes);

export default allRoutes;

