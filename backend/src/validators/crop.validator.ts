import { z } from 'zod';

export const createCropSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        variety: z.string().optional(),
        plantingDate: z.string().datetime(), // Expect ISO string
        harvestDate: z.string().datetime().optional(),
        status: z.enum(['PLANTED', 'GROWING', 'HARVESTED', 'FAILED']).default('PLANTED'),
        area: z.number().min(0),
        farmId: z.string().uuid(),
    }),
});

export const updateCropSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        variety: z.string().optional(),
        plantingDate: z.string().datetime().optional(),
        harvestDate: z.string().datetime().optional(),
        status: z.enum(['PLANTED', 'GROWING', 'HARVESTED', 'FAILED']).optional(),
        area: z.number().optional(),
    }),
});
