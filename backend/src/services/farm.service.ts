import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

export const createFarm = async (data: Prisma.FarmCreateInput) => {
    return await prisma.farm.create({
        data,
    });
};

export const getFarmsByUser = async (userId: string) => {
    return await prisma.farm.findMany({
        where: { userId },
        include: {
            crops: true,
            inventory: true,
        },
    });
};

export const getFarmById = async (id: string) => {
    return await prisma.farm.findUnique({
        where: { id },
        include: {
            crops: true,
            transactions: true,
            inventory: true,
        },
    });
};

export const updateFarm = async (id: string, data: Prisma.FarmUpdateInput) => {
    return await prisma.farm.update({
        where: { id },
        data,
    });
};

export const deleteFarm = async (id: string) => {
    return await prisma.farm.delete({
        where: { id },
    });
};
