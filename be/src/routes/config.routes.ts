import { Router } from 'express';
import { getDeadline } from '../controllers/config.controller';

const router = Router();

router.get('/deadline', getDeadline);

export default router;
