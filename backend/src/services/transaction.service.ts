import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

export const createTransaction = async (data: Prisma.TransactionCreateInput) => {
    return await prisma.transaction.create({
        data,
    });
};

export const getTransactionsByFarm = async (farmId: string) => {
    return await prisma.transaction.findMany({
        where: { farmId },
        orderBy: { date: 'desc' },
    });
};

export const getTransactionById = async (id: string) => {
    return await prisma.transaction.findUnique({
        where: { id },
    });
};

export const updateTransaction = async (id: string, data: Prisma.TransactionUpdateInput) => {
    return await prisma.transaction.update({
        where: { id },
        data,
    });
};

export const deleteTransaction = async (id: string) => {
    return await prisma.transaction.delete({
        where: { id },
    });
};
