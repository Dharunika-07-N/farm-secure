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

// Submit a new outbreak report
router.post('/report', asyncHandler(async (req, res) => {
    const { disease, location, affected, description } = req.body;

    if (!disease || !location) {
        res.status(400);
        throw new Error('Disease type and location are required');
    }

    // In a real application, this would:
    // 1. Create a record in 'OutbreakReport' table
    // 2. Trigger an email to authorities (using nodemailer)
    // 3. Send WebSocket notification to admins

    console.log("------------------------------------------");
    console.log("📝 NEW DISEASE OUTBREAK REPORT RECEIVED");
    console.log(`Disease: ${disease}`);
    console.log(`Location: ${location}`);
    console.log(`Affected: ${affected}`);
    console.log(`Description: ${description}`);
    console.log("------------------------------------------");

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(201).json({
        success: true,
        message: "Report submitted successfully to veterinary authorities."
    });
}));

export default router;
