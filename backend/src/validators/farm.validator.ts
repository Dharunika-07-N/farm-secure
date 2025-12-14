import { z } from 'zod';

export const createFarmSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        location: z.string().min(1, 'Location is required'),
        size: z.number().min(0, 'Size must be positive'),
        sizeUnit: z.string().default('acres'),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
    }),
});

export const updateFarmSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        location: z.string().optional(),
        size: z.number().optional(),
        sizeUnit: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
    }),
});
