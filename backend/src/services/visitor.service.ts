import prisma from '@/utils/prisma';

export const getVisitors = async (farmId: string) => {
    return prisma.visitorLog.findMany({
        where: { farmId },
        orderBy: { entryTime: 'desc' }
    });
};

export const logVisitor = async (farmId: string, data: any) => {
    return prisma.visitorLog.create({
        data: {
            ...data,
            farmId,
            entryTime: new Date(data.entryTime || Date.now()),
            exitTime: data.exitTime ? new Date(data.exitTime) : null
        }
    });
};

export const updateVisitorExit = async (visitorId: string, exitTime: string) => {
    return prisma.visitorLog.update({
        where: { id: visitorId },
        data: { exitTime: new Date(exitTime) }
    });
};
