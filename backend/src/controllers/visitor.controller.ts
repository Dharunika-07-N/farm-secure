import { Request, Response } from 'express';
import * as visitorService from '@/services/visitor.service';
import asyncHandler from '@/utils/asyncHandler';

export const getVisitors = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.params;
    const visitors = await visitorService.getVisitors(farmId);
    res.json({ success: true, data: visitors });
});

export const logVisitor = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.params;
    const visitor = await visitorService.logVisitor(farmId, req.body);
    res.status(201).json({ success: true, data: visitor });
});

export const updateExitTime = asyncHandler(async (req: Request, res: Response) => {
    const { visitorId } = req.params;
    const { exitTime } = req.body;
    const updated = await visitorService.updateVisitorExit(visitorId, exitTime);
    res.json({ success: true, data: updated });
});
