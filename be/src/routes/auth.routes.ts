import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.loginHandler);
router.post('/logout', authController.logoutHandler);

export default router;
