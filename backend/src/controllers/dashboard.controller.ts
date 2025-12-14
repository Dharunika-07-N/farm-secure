import { Request, Response } from 'express';
import * as dashboardService from '@/services/dashboard.service';
import asyncHandler from '@/utils/asyncHandler';

export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not authenticated");

    const [stats, alerts, compliance] = await Promise.all([
        dashboardService.getDashboardStats(req.user.id),
        dashboardService.getRecentAlerts(req.user.id),
        dashboardService.getComplianceItems(req.user.id)
    ]);

    res.status(200).json({
        success: true,
        data: {
            stats,
            alerts,
            compliance
        }
    });
});
