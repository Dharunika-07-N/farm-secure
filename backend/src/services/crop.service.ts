import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

export const createCrop = async (data: Prisma.CropCreateInput) => {
    return await prisma.crop.create({
        data,
    });
};

export const getCropsByFarm = async (farmId: string) => {
    return await prisma.crop.findMany({
        where: { farmId },
    });
};

export const getCropById = async (id: string) => {
    return await prisma.crop.findUnique({
        where: { id },
    });
};

export const updateCrop = async (id: string, data: Prisma.CropUpdateInput) => {
    return await prisma.crop.update({
        where: { id },
        data,
    });
};

export const deleteCrop = async (id: string) => {
    return await prisma.crop.delete({
        where: { id },
    });
};
