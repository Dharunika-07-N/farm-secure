import { Router } from 'express';
import * as inventoryController from '@/controllers/inventory.controller';
import validate from '@/middleware/validate';
import { createInventorySchema, updateInventorySchema } from '@/validators/inventory.validator';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', validate(createInventorySchema), inventoryController.createInventoryItem);
router.get('/', inventoryController.getInventoryItems);
router.get('/:id', inventoryController.getInventoryItem);
router.patch('/:id', validate(updateInventorySchema), inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

export default router;
