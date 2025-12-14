import { Router } from 'express';
import { syncWAHISData } from '@/services/wahis.service';
import { syncProMEDData } from '@/services/promed.service';
import asyncHandler from '@/utils/asyncHandler';
import { protect } from '@/middleware/auth.middleware';

const router = Router();

/**
 * Manually trigger WAHIS data sync
 */
router.post('/wahis', protect, asyncHandler(async (req, res) => {
    const result = await syncWAHISData();

    res.json({
        success: true,
        message: 'WAHIS data sync completed',
        synced: result.synced,
        errors: result.errors,
    });
}));

/**
 * Sync outbreak data from ProMED-mail RSS feed (WORKING!)
 * This fetches real, current animal disease outbreak data
 */
router.post('/promed', protect, asyncHandler(async (req, res) => {
    const result = await syncProMEDData();

    res.json({
        success: true,
        message: 'ProMED data sync completed',
        synced: result.synced,
        skipped: result.skipped,
        errors: result.errors,
    });
}));

export default router;
