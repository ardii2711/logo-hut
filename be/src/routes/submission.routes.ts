import { Router } from 'express';
import { uploadSubmission } from '../middleware/upload.middleware';
import * as submissionController from '../controllers/submission.controller';

const router = Router();

router.post('/', uploadSubmission, submissionController.create);

export default router;
