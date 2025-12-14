import { Router } from 'express';
import * as dashboardController from '@/controllers/dashboard.controller';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', dashboardController.getDashboardData);

export default router;
