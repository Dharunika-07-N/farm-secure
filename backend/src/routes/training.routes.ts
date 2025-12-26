import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/training/modules
 * Get all training modules
 */
router.get('/modules', async (req: Request, res: Response) => {
    try {
        const modules = await prisma.trainingModule.findMany({
            where: { isActive: true },
            orderBy: { category: 'asc' },
        });

        // Parse JSON fields
        const parsedModules = modules.map(module => ({
            ...module,
            objectives: JSON.parse(module.objectives),
            content: JSON.parse(module.content),
        }));

        res.json(parsedModules);
    } catch (error: any) {
        console.error('Error fetching training modules:', error);
        res.status(500).json({ error: 'Failed to fetch training modules' });
    }
});

/**
 * GET /api/v1/training/modules/:id
 * Get a specific training module by ID
 */
router.get('/modules/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const module = await prisma.trainingModule.findUnique({
            where: { id },
        });

        if (!module) {
            return res.status(404).json({ error: 'Training module not found' });
        }

        // Parse JSON fields
        const parsedModule = {
            ...module,
            objectives: JSON.parse(module.objectives),
            content: JSON.parse(module.content),
        };

        res.json(parsedModule);
    } catch (error: any) {
        console.error('Error fetching training module:', error);
        res.status(500).json({ error: 'Failed to fetch training module' });
    }
});

/**
 * GET /api/v1/training/categories
 * Get all unique training categories
 */
router.get('/categories', async (req: Request, res: Response) => {
    try {
        const modules = await prisma.trainingModule.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category'],
        });

        const categories = modules.map(m => m.category);
        res.json(categories);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

export default router;
