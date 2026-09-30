import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Protected routes
router.get('/submissions', verifyAuth, adminController.list);
router.get('/submissions/:id', verifyAuth, adminController.detail);

export default router;
