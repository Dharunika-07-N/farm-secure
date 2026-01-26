import prisma from '@/utils/prisma';
import { ApiError } from '@/utils/ApiError';

export const getBatches = async (farmId: string) => {
    return prisma.animalBatch.findMany({
        where: { farmId },
        include: {
            _count: {
                select: { movements: true, mortality: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const createBatch = async (farmId: string, data: any) => {
    return prisma.animalBatch.create({
        data: {
            ...data,
            farmId,
            arrivalDate: new Date(data.arrivalDate)
        }
    });
};

export const recordMortality = async (batchId: string, data: any) => {
    const batch = await prisma.animalBatch.findUnique({ where: { id: batchId } });
    if (!batch) throw new ApiError(404, 'Batch not found');

    if (batch.quantity < data.quantity) {
        throw new ApiError(400, 'Mortality quantity cannot exceed batch quantity');
    }

    return prisma.$transaction([
        prisma.mortalityRecord.create({
            data: {
                ...data,
                batchId,
                date: new Date(data.date || Date.now())
            }
        }),
        prisma.animalBatch.update({
            where: { id: batchId },
            data: { quantity: { decrement: data.quantity } }
        })
    ]);
};

export const recordMovement = async (batchId: string, data: any) => {
    return prisma.movementLog.create({
        data: {
            ...data,
            batchId,
            date: new Date(data.date || Date.now())
        }
    });
};
