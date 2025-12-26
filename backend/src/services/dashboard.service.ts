import prisma from '@/utils/prisma';

export const getDashboardStats = async (userId: string) => {
    // Get all farms for user to aggregate data
    const farms = await prisma.farm.findMany({
        where: { userId },
        include: {
            alerts: true,
            compliance: true,
        }
    });

    // Calculate aggregated statistics
    const totalFarms = farms.length;
    const activeProtocols = farms.reduce((acc, farm) => acc + farm.compliance.length, 0); // Simplified
    const openAlerts = farms.reduce((acc, farm) => acc + farm.alerts.filter(a => !a.isRead).length, 0);

    // Get latest biosecurity score from risk assessments
    const latestAssessment = await (prisma as any).RiskAssessment.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    const biosecurityScore = latestAssessment ? latestAssessment.score : 0;

    return {
        biosecurityScore: `${biosecurityScore}%`,
        activeProtocols,
        openAlerts,
    };
}

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

export const getWeatherData = async (userId: string) => {
    // Get the first farm's coordinates
    const farm = await prisma.farm.findFirst({
        where: { userId, latitude: { not: null }, longitude: { not: null } }
    });

    if (!farm || !farm.latitude || !farm.longitude) {
        return null;
    }

    const { getCurrentWeather } = await import('./weather.service');
    return await getCurrentWeather(farm.latitude, farm.longitude);
};
