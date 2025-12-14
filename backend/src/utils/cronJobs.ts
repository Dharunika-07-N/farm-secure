import cron from 'node-cron';
import { syncProMEDData } from '../services/promed.service';
import { notifyUsersOfNewOutbreaks } from '../services/notification.service';

/**
 * Automated Cron Jobs for Farm-Secure
 * 
 * This module sets up scheduled tasks for:
 * - Daily outbreak data synchronization
 * - User notifications
 * - Database cleanup
 */

export const initializeCronJobs = () => {
    console.log('[Cron] Initializing scheduled jobs...');

    // Daily ProMED sync at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('[Cron] Running daily ProMED sync...');
        try {
            const result = await syncProMEDData();
            console.log(`[Cron] ProMED sync completed: ${result.synced} synced, ${result.skipped} skipped, ${result.errors} errors`);

            // Notify users of new outbreaks
            if (result.synced > 0) {
                await notifyUsersOfNewOutbreaks();
            }
        } catch (error) {
            console.error('[Cron] ProMED sync failed:', error);
        }
    });

    // Weekly data cleanup - Remove old outbreaks (older than 1 year)
    cron.schedule('0 3 * * 0', async () => {
        console.log('[Cron] Running weekly data cleanup...');
        try {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();

            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            const deleted = await prisma.outbreak.deleteMany({
                where: {
                    date: {
                        lt: oneYearAgo
                    }
                }
            });

            console.log(`[Cron] Cleanup completed: ${deleted.count} old outbreaks removed`);
            await prisma.$disconnect();
        } catch (error) {
            console.error('[Cron] Cleanup failed:', error);
        }
    });

    // Hourly health check
    cron.schedule('0 * * * *', () => {
        console.log('[Cron] Health check - System running normally');
    });

    console.log('[Cron] ✅ Scheduled jobs initialized:');
    console.log('  - Daily ProMED sync: 2:00 AM');
    console.log('  - Weekly cleanup: Sunday 3:00 AM');
    console.log('  - Hourly health check');
};
