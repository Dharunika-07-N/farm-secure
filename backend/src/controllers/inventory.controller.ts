import { Request, Response } from 'express';
import * as inventoryService from '@/services/inventory.service';
import asyncHandler from '@/utils/asyncHandler';

export const createInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const { farmId, ...rest } = req.body;
    const item = await inventoryService.createInventoryItem({
        ...rest,
        farm: { connect: { id: farmId } }
    });
    res.status(201).json({ success: true, data: item });
});

export const getInventoryItems = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.query;
    if (!farmId) {
        res.status(400);
        throw new Error("farmId query parameter is required");
    }
    const items = await inventoryService.getInventoryByFarm(farmId as string);
    res.status(200).json({ success: true, data: items });
});

export const getInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Inventory item not found');
    }
    res.status(200).json({ success: true, data: item });
});

export const updateInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
});

export const deleteInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    await inventoryService.deleteInventoryItem(req.params.id);
    res.status(200).json({ success: true, message: 'Inventory item deleted successfully' });
});
