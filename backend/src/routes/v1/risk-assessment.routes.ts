import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import asyncHandler from '@/utils/asyncHandler';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

/**
 * POST /api/v1/risk-assessment
 * Save a new risk assessment result
 */
router.post('/', protect, asyncHandler(async (req: Request, res: Response) => {
    const { score, level, recommendations, answers } = req.body;
    const userId = req.user!.id;

    const assessment = await (prisma as any).RiskAssessment.create({
        data: {
            score,
            level,
            recommendations: JSON.stringify(recommendations),
            answers: JSON.stringify(answers),
            userId,
        },
    });

    res.status(201).json({
        success: true,
        data: assessment,
    });
}));

/**
 * GET /api/v1/risk-assessment/history
 * Get user's risk assessment history
 */
router.get('/history', protect, asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const history = await (prisma as any).RiskAssessment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields
    const parsedHistory = history.map((item: any) => ({
        ...item,
        recommendations: JSON.parse(item.recommendations),
        answers: JSON.parse(item.answers),
    }));

    res.json({
        success: true,
        data: parsedHistory,
    });
}));

export default router;
