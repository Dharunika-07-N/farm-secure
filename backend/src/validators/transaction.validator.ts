import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['INCOME', 'EXPENSE']),
        category: z.string().min(1),
        amount: z.number().positive(),
        description: z.string().optional(),
        date: z.string().datetime(),
        farmId: z.string().uuid(),
    }),
});

export const updateTransactionSchema = z.object({
    body: z.object({
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().optional(),
        amount: z.number().positive().optional(),
        description: z.string().optional(),
        date: z.string().datetime().optional(),
    }),
});
