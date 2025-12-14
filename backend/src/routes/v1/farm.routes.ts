import { Router } from 'express';
import * as farmController from '@/controllers/farm.controller';
import validate from '@/middleware/validate';
import { createFarmSchema, updateFarmSchema } from '@/validators/farm.validator';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect); // All farm routes require authentication

router.post('/', validate(createFarmSchema), farmController.createFarm);
router.get('/', farmController.getFarms);
router.get('/:id', farmController.getFarm);
router.patch('/:id', validate(updateFarmSchema), farmController.updateFarm);
router.delete('/:id', farmController.deleteFarm);

export default router;
