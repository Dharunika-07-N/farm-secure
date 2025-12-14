import { z } from 'zod';

export const createInventorySchema = z.object({
    body: z.object({
        itemName: z.string().min(1),
        quantity: z.number().nonnegative(),
        unit: z.string().min(1),
        category: z.enum(['SEEDS', 'FERTILIZER', 'PESTICIDE', 'EQUIPMENT', 'OTHER']),
        lowStockAlert: z.number().optional(),
        farmId: z.string().uuid(),
    }),
});

export const updateInventorySchema = z.object({
    body: z.object({
        itemName: z.string().optional(),
        quantity: z.number().nonnegative().optional(),
        unit: z.string().optional(),
        category: z.enum(['SEEDS', 'FERTILIZER', 'PESTICIDE', 'EQUIPMENT', 'OTHER']).optional(),
        lowStockAlert: z.number().optional(),
    }),
});
