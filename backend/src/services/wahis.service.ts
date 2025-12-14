import axios from 'axios';
import prisma from '@/utils/prisma';

/**
 * WOAH WAHIS API Integration
 * World Organisation for Animal Health - World Animal Health Information System
 * 
 * This service fetches real-time animal disease outbreak data from WOAH's WAHIS platform.
 * WAHIS provides validated official data on animal diseases globally.
 */

interface WAHISOutbreak {
    reportId: string;
    country: string;
    disease: string;
    latitude?: number;
    longitude?: number;
    reportDate: string;
    affectedAnimals?: number;
    severity?: string;
}

// WAHIS public data endpoint (reverse-engineered from public interface)
const WAHIS_BASE_URL = 'https://wahis.woah.org/pi/api';

/**
 * Fetch recent outbreaks from WAHIS
 * Note: This is a simplified implementation. In production, you may need to:
 * 1. Request official API access from WOAH
 * 2. Handle pagination for large datasets
 * 3. Implement rate limiting
 */
export const fetchWAHISOutbreaks = async (): Promise<WAHISOutbreak[]> => {
    try {
        // Example endpoint - actual endpoint may vary
        // You may need to explore WAHIS's public interface or request API documentation
        const response = await axios.get(`${WAHIS_BASE_URL}/outbreaks`, {
            params: {
                startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Last 90 days
                endDate: new Date().toISOString(),
            },
            timeout: 10000,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch WAHIS data:', error);
        return [];
    }
};

/**
 * Map WAHIS disease names to our internal disease types
 */
const mapDiseaseType = (wahisDisease: string): string => {
    const diseaseMap: Record<string, string> = {
        'Highly pathogenic avian influenza': 'avian_influenza',
        'Avian influenza': 'avian_influenza',
        'H5N1': 'avian_influenza',
        'H5N8': 'avian_influenza',
        'African swine fever': 'african_swine_fever',
        'ASF': 'african_swine_fever',
        'Newcastle disease': 'newcastle_disease',
        'Foot and mouth disease': 'foot_mouth',
        'FMD': 'foot_mouth',
    };

    for (const [key, value] of Object.entries(diseaseMap)) {
        if (wahisDisease.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    return 'avian_influenza'; // Default fallback
};

/**
 * Determine severity based on affected animals count
 */
const calculateSeverity = (affectedAnimals?: number): string => {
    if (!affectedAnimals) return 'medium';
    if (affectedAnimals > 1000) return 'high';
    if (affectedAnimals > 100) return 'medium';
    return 'low';
};

/**
 * Sync WAHIS data to local database
 * This should be called periodically (e.g., daily via cron job)
 */
export const syncWAHISData = async () => {
    try {
        console.log('[WAHIS Sync] Starting outbreak data sync...');

        const wahisOutbreaks = await fetchWAHISOutbreaks();

        if (wahisOutbreaks.length === 0) {
            console.log('[WAHIS Sync] No new outbreaks found');
            return { synced: 0, errors: 0 };
        }

        let synced = 0;
        let errors = 0;

        for (const outbreak of wahisOutbreaks) {
            try {
                // Skip if no coordinates
                if (!outbreak.latitude || !outbreak.longitude) {
                    continue;
                }

                // Check if outbreak already exists
                const existing = await prisma.outbreak.findFirst({
                    where: {
                        name: {
                            contains: outbreak.reportId,
                        },
                    },
                });

                if (existing) {
                    console.log(`[WAHIS Sync] Outbreak ${outbreak.reportId} already exists, skipping`);
                    continue;
                }

                // Create new outbreak record
                await prisma.outbreak.create({
                    data: {
                        name: `${outbreak.disease} - ${outbreak.country}`,
                        type: mapDiseaseType(outbreak.disease),
                        latitude: outbreak.latitude,
                        longitude: outbreak.longitude,
                        severity: outbreak.severity || calculateSeverity(outbreak.affectedAnimals),
                        date: new Date(outbreak.reportDate),
                        affectedAnimals: outbreak.affectedAnimals || 0,
                        riskRadius: outbreak.affectedAnimals && outbreak.affectedAnimals > 1000 ? 50 : 25,
                    },
                });

                synced++;
                console.log(`[WAHIS Sync] Created outbreak: ${outbreak.disease} in ${outbreak.country}`);
            } catch (err) {
                errors++;
                console.error(`[WAHIS Sync] Error processing outbreak ${outbreak.reportId}:`, err);
            }
        }

        console.log(`[WAHIS Sync] Completed. Synced: ${synced}, Errors: ${errors}`);
        return { synced, errors };
    } catch (error) {
        console.error('[WAHIS Sync] Fatal error during sync:', error);
        throw error;
    }
};

/**
 * Alternative: Fetch from ProMED-mail RSS feed
 * ProMED is a free public health surveillance system for disease outbreaks
 */
export const fetchProMEDOutbreaks = async () => {
    try {
        // ProMED RSS feed for animal diseases
        const response = await axios.get('https://promedmail.org/ajax/runSearch.php', {
            params: {
                feed: 'animal',
                format: 'rss',
            },
            timeout: 10000,
        });

        // Parse RSS and extract outbreak information
        // This would require an RSS parser library
        return response.data;
    } catch (error) {
        console.error('Failed to fetch ProMED data:', error);
        return [];
    }
};
