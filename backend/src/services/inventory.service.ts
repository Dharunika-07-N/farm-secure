import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

export const createInventoryItem = async (data: Prisma.InventoryCreateInput) => {
    return await prisma.inventory.create({
        data,
    });
};

export const getInventoryByFarm = async (farmId: string) => {
    return await prisma.inventory.findMany({
        where: { farmId },
    });
};

export const getInventoryItemById = async (id: string) => {
    return await prisma.inventory.findUnique({
        where: { id },
    });
};

export const updateInventoryItem = async (id: string, data: Prisma.InventoryUpdateInput) => {
    return await prisma.inventory.update({
        where: { id },
        data,
    });
};

export const deleteInventoryItem = async (id: string) => {
    return await prisma.inventory.delete({
        where: { id },
    });
};
