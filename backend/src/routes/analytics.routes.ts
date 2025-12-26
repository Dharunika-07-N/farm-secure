import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/analytics/stats
 * Get disease statistics with filtering
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const { state, year, type } = req.query;

        const whereClause: any = {};
        if (state) whereClause.state = state as string;
        if (year) whereClause.year = parseInt(year as string);
        if (type) whereClause.diseaseType = type as string;

        const stats = await prisma.diseaseStatistic.findMany({
            where: whereClause,
            orderBy: [{ year: 'asc' }, { state: 'asc' }],
        });

        // Parse metadata JSON
        const parsedStats = stats.map(stat => ({
            ...stat,
            metadata: stat.metadata ? JSON.parse(stat.metadata) : null,
        }));

        res.json(parsedStats);
    } catch (error: any) {
        console.error('Error fetching disease stats:', error);
        res.status(500).json({ error: 'Failed to fetch disease statistics' });
    }
});

/**
 * GET /api/v1/analytics/risk-factors
 * Get risk multipliers
 */
router.get('/risk-factors', async (req: Request, res: Response) => {
    try {
        const factors = await prisma.riskFactor.findMany({
            orderBy: { factor: 'asc' },
        });
        res.json(factors);
    } catch (error: any) {
        console.error('Error fetching risk factors:', error);
        res.status(500).json({ error: 'Failed to fetch risk factors' });
    }
});

/**
 * GET /api/v1/analytics/indicators
 * Get biosecurity indicators
 */
router.get('/indicators', async (req: Request, res: Response) => {
    try {
        const indicators = await prisma.biosecurityIndicator.findMany({
            orderBy: { indicatorId: 'asc' },
        });
        res.json(indicators);
    } catch (error: any) {
        console.error('Error fetching indicators:', error);
        res.status(500).json({ error: 'Failed to fetch indicators' });
    }
});

/**
 * GET /api/v1/analytics/aggregate/yearly
 * Get yearly aggregated stats for charts
 */
router.get('/aggregate/yearly', async (req: Request, res: Response) => {
    try {
        const stats = await prisma.diseaseStatistic.groupBy({
            by: ['year', 'diseaseType'],
            _sum: {
                deaths: true,
                outbreaks: true,
            },
            orderBy: { year: 'asc' },
        });

        res.json(stats);
    } catch (error: any) {
        console.error('Error fetching aggregated stats:', error);
        res.status(500).json({ error: 'Failed to fetch aggregated stats' });
    }
});

export default router;
