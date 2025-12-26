import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/diseases
 * Get all diseases with optional filtering
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { riskLevel, type, species } = req.query;

        const diseases = await prisma.disease.findMany({
            orderBy: { name: 'asc' },
        });

        // Parse JSON fields and apply filters
        let parsedDiseases = diseases.map(disease => ({
            ...disease,
            affectedSpecies: JSON.parse(disease.affectedSpecies),
            symptoms: JSON.parse(disease.symptoms),
            preventionMeasures: JSON.parse(disease.preventionMeasures),
            transmissionRoutes: JSON.parse(disease.transmissionRoutes),
        }));

        // Apply filters
        if (riskLevel) {
            parsedDiseases = parsedDiseases.filter(d =>
                d.riskLevel.toLowerCase() === (riskLevel as string).toLowerCase()
            );
        }

        if (type) {
            parsedDiseases = parsedDiseases.filter(d =>
                d.type.toLowerCase() === (type as string).toLowerCase()
            );
        }

        if (species) {
            parsedDiseases = parsedDiseases.filter(d =>
                d.affectedSpecies.some((s: string) =>
                    s.toLowerCase().includes((species as string).toLowerCase())
                )
            );
        }

        res.json(parsedDiseases);
    } catch (error: any) {
        console.error('Error fetching diseases:', error);
        res.status(500).json({ error: 'Failed to fetch diseases' });
    }
});

/**
 * GET /api/v1/diseases/:id
 * Get a specific disease by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const disease = await prisma.disease.findUnique({
            where: { id },
        });

        if (!disease) {
            return res.status(404).json({ error: 'Disease not found' });
        }

        // Parse JSON fields
        const parsedDisease = {
            ...disease,
            affectedSpecies: JSON.parse(disease.affectedSpecies),
            symptoms: JSON.parse(disease.symptoms),
            preventionMeasures: JSON.parse(disease.preventionMeasures),
            transmissionRoutes: JSON.parse(disease.transmissionRoutes),
        };

        res.json(parsedDisease);
    } catch (error: any) {
        console.error('Error fetching disease:', error);
        res.status(500).json({ error: 'Failed to fetch disease' });
    }
});

/**
 * GET /api/v1/diseases/search/:name
 * Search for diseases by name
 */
router.get('/search/:name', async (req: Request, res: Response) => {
    try {
        const { name } = req.params;

        const diseases = await prisma.disease.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
        });

        // Parse JSON fields
        const parsedDiseases = diseases.map(disease => ({
            ...disease,
            affectedSpecies: JSON.parse(disease.affectedSpecies),
            symptoms: JSON.parse(disease.symptoms),
            preventionMeasures: JSON.parse(disease.preventionMeasures),
            transmissionRoutes: JSON.parse(disease.transmissionRoutes),
        }));

        res.json(parsedDiseases);
    } catch (error: any) {
        console.error('Error searching diseases:', error);
        res.status(500).json({ error: 'Failed to search diseases' });
    }
});

export default router;
