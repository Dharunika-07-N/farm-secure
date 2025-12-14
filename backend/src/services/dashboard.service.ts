import prisma from '@/utils/prisma';

export const getDashboardStats = async (userId: string) => {
    // Get all farms for user to aggregate data
    const farms = await prisma.farm.findMany({
        where: { userId },
        include: {
            alerts: true,
            compliance: true,
            // crops: true,
        }
    });

    // Calculate stats
    // For demo, we mock some calculations or perform real counts
    const totalFarms = farms.length;
    const activeProtocols = farms.reduce((acc, farm) => acc + farm.compliance.length, 0); // Simplified
    const openAlerts = farms.reduce((acc, farm) => acc + farm.alerts.filter(a => !a.isRead).length, 0);

    // Mock scores for now as we don't have logic for them
    const biosecurityScore = 78; // Hardcoded or calculated based on compliance

    return {
        biosecurityScore: `${biosecurityScore}%`,
        activeProtocols,
        staffTrained: "8/10", // Placeholder as we don't have Staff model yet
        openAlerts,
    };
};

export const getRecentAlerts = async (userId: string) => {
    return await prisma.alert.findMany({
        where: {
            farm: { userId }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });
};

export const getComplianceItems = async (userId: string) => {
    // Get compliance items from the first farm or aggregate?
    // For dashboard, we might want a list of pending items.
    return await prisma.compliance.findMany({
        where: { farm: { userId } },
        take: 5
    });
};
