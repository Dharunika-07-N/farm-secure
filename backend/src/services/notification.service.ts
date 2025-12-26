import nodemailer from 'nodemailer';
import prisma from '@/utils/prisma';

/**
 * Email Notification Service
 * 
 * Sends email alerts to users about:
 * - New disease outbreaks near their farms
 * - High-severity outbreak warnings
 * - Weekly summary reports
 */

// Email transporter configuration
const createTransporter = () => {
    // For development: Use Ethereal (fake SMTP)
    // For production: Use Gmail, SendGrid, AWS SES, etc.

    if (process.env.NODE_ENV === 'production') {
        // Production email configuration
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Development: Log emails to console
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER || 'test@ethereal.email',
                pass: process.env.ETHEREAL_PASS || 'test123',
            },
        });
    }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Send email notification
 */
const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = createTransporter();

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Farm-Secure Alerts" <alerts@farmsecure.com>',
            to,
            subject,
            html,
        });

        console.log(`[Email] Sent to ${to}: ${info.messageId}`);

        // In development, log preview URL
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Email] Preview: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return true;
    } catch (error) {
        console.error(`[Email] Failed to send to ${to}:`, error);
        return false;
    }
};

/**
 * Notify users of new outbreaks near their farms
 */
export const notifyUsersOfNewOutbreaks = async () => {
    try {
        console.log('[Notification] Checking for users to notify...');

        // Get all users with farms
        const users = await prisma.user.findMany({
            include: {
                farms: true,
            },
        });

        // Get recent outbreaks (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recentOutbreaks = await prisma.outbreak.findMany({
            where: {
                createdAt: {
                    gte: yesterday,
                },
            },
        });

        if (recentOutbreaks.length === 0) {
            console.log('[Notification] No new outbreaks to notify about');
            return { sent: 0, failed: 0 };
        }

        let sent = 0;
        let failed = 0;

        for (const user of users) {
            const nearbyOutbreaks = [];

            for (const farm of user.farms) {
                // Use farm's real coordinates, fallback to default if missing
                const farmLat = farm.latitude || 28.7041; // Default: Delhi
                const farmLng = farm.longitude || 77.1025;

                for (const outbreak of recentOutbreaks) {
                    const distance = calculateDistance(
                        farmLat,
                        farmLng,
                        outbreak.latitude,
                        outbreak.longitude
                    );

                    // Alert if outbreak is within 200km
                    if (distance <= 200) {
                        nearbyOutbreaks.push({
                            ...outbreak,
                            distance: Math.round(distance),
                            farmName: farm.name,
                        });
                    }
                }
            }

            if (nearbyOutbreaks.length > 0) {
                // Determine if we should send email
                if (user.emailNotifications) {
                    const success = await sendOutbreakAlert(user.email, user.firstName, nearbyOutbreaks);
                    if (success) sent++;
                    else failed++;
                }
            }
        }

        console.log(`[Notification] Completed: ${sent} sent, ${failed} failed`);
        return { sent, failed };
    } catch (error) {
        console.error('[Notification] Error:', error);
        throw error;
    }
};

/**
 * Send outbreak alert email
 */
const sendOutbreakAlert = async (
    email: string,
    firstName: string,
    outbreaks: any[]
) => {
    const subject = `⚠️ ${outbreaks.length} Disease Outbreak${outbreaks.length > 1 ? 's' : ''} Detected Near Your Farm`;

    const outbreakList = outbreaks
        .map(
            (o) => `
      <div style="background: #f9fafb; padding: 15px; margin: 10px 0; border-left: 4px solid ${o.severity === 'high' ? '#dc2626' : o.severity === 'medium' ? '#ea580c' : '#0891b2'
                };">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${o.name}</h3>
        <p style="margin: 5px 0; color: #6b7280;">
          <strong>Distance:</strong> ${o.distance} km from ${o.farmName}<br>
          <strong>Severity:</strong> <span style="color: ${o.severity === 'high' ? '#dc2626' : o.severity === 'medium' ? '#ea580c' : '#0891b2'
                }; text-transform: uppercase;">${o.severity}</span><br>
          <strong>Affected Animals:</strong> ${o.affectedAnimals.toLocaleString()}<br>
          <strong>Risk Radius:</strong> ${o.riskRadius} km<br>
          <strong>Reported:</strong> ${new Date(o.date).toLocaleDateString()}
        </p>
      </div>
    `
        )
        .join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🔔 Farm-Secure Alert</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Disease Outbreak Notification</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #1f2937;">Hi ${firstName},</p>
        
        <p style="color: #4b5563;">
          We've detected <strong>${outbreaks.length}</strong> new disease outbreak${outbreaks.length > 1 ? 's' : ''} 
          within 200km of your farm${outbreaks.length > 1 ? 's' : ''}. Please review the details below and take necessary biosecurity precautions.
        </p>

        ${outbreakList}

        <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">⚠️ Recommended Actions:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #78350f;">
            <li>Review and strengthen biosecurity protocols</li>
            <li>Limit visitor access to your farm</li>
            <li>Monitor your animals for symptoms</li>
            <li>Contact local veterinary authorities</li>
            <li>Update your vaccination schedules</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/disease-map" 
             style="background: #2d6a4f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View on Disease Map
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          This is an automated alert from Farm-Secure. You're receiving this because you have registered farms in our system.
          <br><br>
          Stay safe and maintain strict biosecurity measures.
          <br><br>
          <strong>Farm-Secure Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;

    return await sendEmail(email, subject, html);
};

/**
 * Send weekly summary report
 */
export const sendWeeklySummary = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { farms: true },
        });

        if (!user) return false;

        // Get outbreaks from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyOutbreaks = await prisma.outbreak.findMany({
            where: {
                createdAt: {
                    gte: weekAgo,
                },
            },
            orderBy: {
                severity: 'desc',
            },
        });

        const subject = `📊 Your Weekly Farm-Secure Summary`;
        const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Weekly Summary - ${new Date().toLocaleDateString()}</h2>
        <p>Hi ${user.firstName},</p>
        <p>Here's your weekly biosecurity summary:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📈 This Week's Statistics</h3>
          <p><strong>New Outbreaks Reported:</strong> ${weeklyOutbreaks.length}</p>
          <p><strong>High Severity:</strong> ${weeklyOutbreaks.filter(o => o.severity === 'high').length}</p>
          <p><strong>Your Farms:</strong> ${user.farms.length}</p>
        </div>

        <p>Stay vigilant and keep your biosecurity protocols up to date!</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
           style="background: #2d6a4f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Dashboard
        </a>
      </body>
      </html>
    `;

        return await sendEmail(user.email, subject, html);
    } catch (error) {
        console.error('[Email] Weekly summary failed:', error);
        return false;
    }
};
