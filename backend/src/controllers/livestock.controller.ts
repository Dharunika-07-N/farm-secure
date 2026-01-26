import { Request, Response } from 'express';
import * as livestockService from '@/services/livestock.service';
import asyncHandler from '@/utils/asyncHandler';

export const getBatches = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.params;
    const batches = await livestockService.getBatches(farmId);
    res.json({ success: true, data: batches });
});

export const createBatch = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.params;
    const batch = await livestockService.createBatch(farmId, req.body);
    res.status(201).json({ success: true, data: batch });
});

export const recordMortality = asyncHandler(async (req: Request, res: Response) => {
    const { batchId } = req.params;
    const record = await livestockService.recordMortality(batchId, req.body);
    res.status(201).json({ success: true, data: record });
});

export const recordMovement = asyncHandler(async (req: Request, res: Response) => {
    const { batchId } = req.params;
    const log = await livestockService.recordMovement(batchId, req.body);
    res.status(201).json({ success: true, data: log });
});
