import { Router } from 'express';
import * as transactionController from '@/controllers/transaction.controller';
import validate from '@/middleware/validate';
import { createTransactionSchema, updateTransactionSchema } from '@/validators/transaction.validator';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', validate(createTransactionSchema), transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.patch('/:id', validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
