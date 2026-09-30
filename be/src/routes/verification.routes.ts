import { Router } from 'express';
import { verifySubmissionCode } from '../controllers/verification.controller';

const router = Router();

router.get('/verify/:code', verifySubmissionCode);

export default router;
