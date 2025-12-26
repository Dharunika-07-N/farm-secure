import prisma from '@/utils/prisma';

export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'OUTBREAK' | 'SYSTEM' | 'SUCCESS';

interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    severity?: 'high' | 'medium' | 'low';
    actionUrl?: string;
    metadata?: Record<string, any>;
}

/**
 * Create a notification for a user
 */
export const createNotification = async (params: CreateNotificationParams) => {
    const { userId, title, message, type = 'INFO', severity, actionUrl, metadata } = params;

    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                severity,
                actionUrl,
                metadata: metadata ? JSON.stringify(metadata) : undefined,
            },
        });

        console.log(`[Notification] Created for user ${userId}: ${title}`);
        return notification;
    } catch (error) {
        console.error('[Notification] Failed to create:', error);
        throw error;
    }
};

/**
 * Create outbreak notification for users near an outbreak
 */
export const createOutbreakNotification = async (
    userId: string,
    outbreakName: string,
    distance: number,
    severity: 'high' | 'medium' | 'low'
) => {
    return createNotification({
        userId,
        title: `⚠️ Disease Outbreak Alert`,
        message: `${outbreakName} detected ${distance}km from your farm. Review biosecurity measures immediately.`,
        type: 'OUTBREAK',
        severity,
        actionUrl: '/disease-map',
        metadata: {
            outbreakName,
            distance,
        },
    });
};

/**
 * Create system notification
 */
export const createSystemNotification = async (userId: string, title: string, message: string) => {
    return createNotification({
        userId,
        title,
        message,
        type: 'SYSTEM',
    });
};

/**
 * Create success notification
 */
export const createSuccessNotification = async (userId: string, title: string, message: string) => {
    return createNotification({
        userId,
        title,
        message,
        type: 'SUCCESS',
    });
};

/**
 * Create warning notification
 */
export const createWarningNotification = async (
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
) => {
    return createNotification({
        userId,
        title,
        message,
        type: 'WARNING',
        actionUrl,
    });
};

/**
 * Seed sample notifications for a user (for testing)
 */
export const seedSampleNotifications = async (userId: string) => {
    const notifications = [
        {
            title: '🎉 Welcome to BioSecure!',
            message: 'Your account has been successfully created. Start by adding your farm details.',
            type: 'SUCCESS' as NotificationType,
            actionUrl: '/profile?tab=farm',
        },
        {
            title: '⚠️ African Swine Fever Detected',
            message: 'New outbreak reported 45km from your farm. Implement strict biosecurity protocols.',
            type: 'OUTBREAK' as NotificationType,
            severity: 'high' as const,
            actionUrl: '/disease-map',
        },
        {
            title: '📊 Weekly Report Available',
            message: 'Your weekly biosecurity summary is ready. Review your farm\'s risk assessment.',
            type: 'INFO' as NotificationType,
            actionUrl: '/dashboard',
        },
        {
            title: '🔔 Vaccination Reminder',
            message: 'Scheduled vaccinations are due in 3 days. Check your compliance calendar.',
            type: 'WARNING' as NotificationType,
            actionUrl: '/compliance',
        },
        {
            title: '✅ Training Module Completed',
            message: 'You\'ve successfully completed "Biosecurity Best Practices". Certificate available.',
            type: 'SUCCESS' as NotificationType,
            actionUrl: '/training',
        },
    ];

    const created = [];
    for (const notif of notifications) {
        const notification = await createNotification({
            userId,
            ...notif,
        });
        created.push(notification);
    }

    console.log(`[Notification] Seeded ${created.length} sample notifications for user ${userId}`);
    return created;
};
