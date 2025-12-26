import { Router } from 'express';
import { protect as authenticate } from '@/middleware/auth.middleware';
import prisma from '@/utils/prisma';

const router = Router();

/**
 * GET /api/v1/notifications
 * Get all notifications for the authenticated user
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user!.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to last 50 notifications
        });

        // Count unread notifications
        const unreadCount = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        res.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('[Notifications] Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

/**
 * GET /api/v1/notifications/unread-count
 * Get count of unread notifications
 */
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const userId = req.user!.id;

        const unreadCount = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('[Notifications] Error fetching unread count:', error);
        res.status(500).json({ message: 'Failed to fetch unread count' });
    }
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a notification as read
 */
router.patch('/:id/read', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify notification belongs to user
        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        res.json(updated);
    } catch (error) {
        console.error('[Notifications] Error marking as read:', error);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
});

/**
 * PATCH /api/v1/notifications/mark-all-read
 * Mark all notifications as read for the user
 */
router.patch('/mark-all-read', authenticate, async (req, res) => {
    try {
        const userId = req.user!.id;

        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('[Notifications] Error marking all as read:', error);
        res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
});

/**
 * DELETE /api/v1/notifications/:id
 * Delete a notification
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify notification belongs to user
        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await prisma.notification.delete({
            where: { id },
        });

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('[Notifications] Error deleting notification:', error);
        res.status(500).json({ message: 'Failed to delete notification' });
    }
});

/**
 * DELETE /api/v1/notifications
 * Delete all notifications for the user
 */
router.delete('/', authenticate, async (req, res) => {
    try {
        const userId = req.user!.id;

        await prisma.notification.deleteMany({
            where: { userId },
        });

        res.json({ message: 'All notifications deleted' });
    } catch (error) {
        console.error('[Notifications] Error deleting all notifications:', error);
        res.status(500).json({ message: 'Failed to delete all notifications' });
    }
});

/**
 * POST /api/v1/notifications/seed
 * Seed sample notifications for the user (for testing)
 */
router.post('/seed', authenticate, async (req, res) => {
    try {
        const userId = req.user!.id;

        // Import the helper function
        const { seedSampleNotifications } = await import('@/utils/notificationHelpers');

        const notifications = await seedSampleNotifications(userId);

        res.json({
            message: 'Sample notifications created',
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        console.error('[Notifications] Error seeding notifications:', error);
        res.status(500).json({ message: 'Failed to seed notifications' });
    }
});

export default router;
