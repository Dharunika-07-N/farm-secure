import { Router, Request, Response } from 'express';
import prisma from '@/utils/prisma';
import asyncHandler from '@/utils/asyncHandler';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

/**
 * GET /api/v1/staff
 * Get all staff members for the user's farms
 */
router.get('/', protect, asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const staff = await (prisma as any).Staff.findMany({
        where: { userId },
        include: {
            farm: { select: { name: true } },
            trainings: {
                include: { trainingModule: { select: { name: true, category: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    res.json({
        success: true,
        data: staff
    });
}));

/**
 * POST /api/v1/staff
 * Create a new staff member
 */
router.post('/', protect, asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, role, phone, email, farmId } = req.body;
    const userId = req.user!.id;

    const staff = await (prisma as any).Staff.create({
        data: {
            firstName,
            lastName,
            role,
            phone,
            email,
            farmId,
            userId
        }
    });

    res.status(201).json({
        success: true,
        data: staff
    });
}));

/**
 * POST /api/v1/staff/:id/training
 * Record a completed training for a staff member
 */
router.post('/:id/training', protect, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { trainingModuleId, score } = req.body;

    const training = await (prisma as any).StaffTraining.create({
        data: {
            staffId: id,
            trainingModuleId,
            score,
            status: 'COMPLETED'
        }
    });

    res.status(201).json({
        success: true,
        data: training
    });
}));

export default router;
