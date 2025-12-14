import { Router } from 'express';
import * as cropController from '@/controllers/crop.controller';
import validate from '@/middleware/validate';
import { createCropSchema, updateCropSchema } from '@/validators/crop.validator';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', validate(createCropSchema), cropController.createCrop);
router.get('/', cropController.getCrops);
router.get('/:id', cropController.getCrop);
router.patch('/:id', validate(updateCropSchema), cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

export default router;
