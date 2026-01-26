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

    // Daily outbreak data sync at 2:00 AM (ProMED + WAHIS)
    cron.schedule('0 2 * * *', async () => {
        console.log('[Cron] Running daily outbreak data sync...');
        try {
            // Sync ProMED data
            const promedResult = await syncProMEDData();
            console.log(`[Cron] ProMED sync completed: ${promedResult.synced} synced, ${promedResult.skipped} skipped, ${promedResult.errors} errors`);

            // Sync WAHIS data
            const { syncWAHISData } = await import('../services/wahis.service');
            const wahisResult = await syncWAHISData();
            console.log(`[Cron] WAHIS sync completed: ${wahisResult.synced} synced, ${wahisResult.errors} errors`);

            // Notify users if any new outbreaks were detected
            const totalNewOutbreaks = promedResult.synced + wahisResult.synced;
            if (totalNewOutbreaks > 0) {
                console.log(`[Cron] Notifying users of ${totalNewOutbreaks} new outbreaks...`);
                await notifyUsersOfNewOutbreaks();
            }
        } catch (error) {
            console.error('[Cron] Outbreak sync failed:', error);
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
    console.log('  - Daily outbreak sync (ProMED + WAHIS): 2:00 AM');
    console.log('  - Weekly cleanup: Sunday 3:00 AM');
    console.log('  - Hourly health check');
};
