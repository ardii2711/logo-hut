import { Router } from 'express';
import { getReceipt } from '../controllers/receipt.controller';

const router = Router();

router.get('/:code/receipt', getReceipt);

export default router;
