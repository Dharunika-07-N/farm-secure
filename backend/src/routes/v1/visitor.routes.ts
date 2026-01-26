import { Router } from 'express';
import * as visitorController from '@/controllers/visitor.controller';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/farm/:farmId', visitorController.getVisitors);
router.post('/farm/:farmId', visitorController.logVisitor);
router.patch('/:visitorId/exit', visitorController.updateExitTime);

export default router;
