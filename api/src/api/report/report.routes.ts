import express from 'express';
import * as reportHandlers from './report.handlers';

const router = express.Router();
router.get('/report', reportHandlers.BuildReport);

export default router;
