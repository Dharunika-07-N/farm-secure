import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '@/utils/asyncHandler';

const router = Router();
const prisma = new PrismaClient();

// Get all outbreaks (public endpoint, no auth required usually, or maybe auth optional)
router.get('/', asyncHandler(async (req, res) => {
    const outbreaks = await prisma.outbreak.findMany({
        orderBy: { date: 'desc' }
    });
    res.json(outbreaks);
}));

export default router;
