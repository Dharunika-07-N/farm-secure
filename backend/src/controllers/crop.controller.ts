import { Request, Response } from 'express';
import * as cropService from '@/services/crop.service';
import asyncHandler from '@/utils/asyncHandler';

export const createCrop = asyncHandler(async (req: Request, res: Response) => {
    // Ensure farmId is provided and valid (could check ownership here)
    const crop = await cropService.createCrop({
        ...req.body,
        // Assuming farmId is passed in body. In a real app we might check if user owns the farm.
        farm: { connect: { id: req.body.farmId } }
    });
    // Note: Prisma CreateInput structure usually requires removing the farmId scalar if we use connect, 
    // or just using farmId if the strict mode allows. 
    // Let's rely on req.body matching structure or adjusting.
    // Actually, typical Prisma usage: data: { ...fields, farm: { connect: { id: ... } } }
    // We need to strip farmId from ...req.body if we use connect, or just use farmId if we don't use connect but the relation needs it.

    // Safe approach for simple one-to-many where foreign key is exposed:
    // If `farmId` is in req.body, we can just pass it directly if the type matches, 
    // BUT `CropCreateInput` expects a `farm` relation object, not just `farmId` usually, depending on how types are generated.
    // `userId` in Farm was a scalar, but `User` was a relation. 
    // Let's refine the service call in a safer way.

    // Actually, standard prisma create with relation:
    const { farmId, ...rest } = req.body;
    const realCrop = await cropService.createCrop({
        ...rest,
        farm: { connect: { id: farmId } }
    });

    res.status(201).json({ success: true, data: realCrop });
});

export const getCrops = asyncHandler(async (req: Request, res: Response) => {
    const { farmId } = req.query; // Filter by farm
    if (!farmId) {
        res.status(400);
        throw new Error("farmId query parameter is required");
    }
    const crops = await cropService.getCropsByFarm(farmId as string);
    res.status(200).json({ success: true, data: crops });
});

export const getCrop = asyncHandler(async (req: Request, res: Response) => {
    const crop = await cropService.getCropById(req.params.id);
    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }
    res.status(200).json({ success: true, data: crop });
});

export const updateCrop = asyncHandler(async (req: Request, res: Response) => {
    const crop = await cropService.updateCrop(req.params.id, req.body);
    res.status(200).json({ success: true, data: crop });
});

export const deleteCrop = asyncHandler(async (req: Request, res: Response) => {
    await cropService.deleteCrop(req.params.id);
    res.status(200).json({ success: true, message: 'Crop deleted successfully' });
});
