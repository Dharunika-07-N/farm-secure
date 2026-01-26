import { Router } from 'express';
import * as livestockController from '@/controllers/livestock.controller';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/farm/:farmId', livestockController.getBatches);
router.post('/farm/:farmId', livestockController.createBatch);
router.post('/batch/:batchId/mortality', livestockController.recordMortality);
router.post('/batch/:batchId/movement', livestockController.recordMovement);

export default router;
