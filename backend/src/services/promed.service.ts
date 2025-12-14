import Parser from 'rss-parser';
import prisma from '@/utils/prisma';

/**
 * ProMED-mail Integration
 * Program for Monitoring Emerging Diseases
 * 
 * ProMED provides free, real-time disease outbreak reports via RSS feeds.
 * This is a reliable, accessible source for animal disease information.
 */

interface ProMEDItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
}

const parser = new Parser();

// ProMED RSS feed for animal diseases
const PROMED_ANIMAL_FEED = 'https://promedmail.org/ajax/runSearch.php?feed=animal&format=rss';

/**
 * Fetch recent animal disease reports from ProMED
 */
export const fetchProMEDReports = async (): Promise<ProMEDItem[]> => {
    try {
        const feed = await parser.parseURL(PROMED_ANIMAL_FEED);
        return feed.items as ProMEDItem[];
    } catch (error) {
        console.error('[ProMED] Failed to fetch RSS feed:', error);
        return [];
    }
};

/**
 * Extract disease type from ProMED title
 * ProMED titles typically follow format: "DISEASE NAME - LOCATION"
 */
const extractDiseaseType = (title: string): string => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes('avian influenza') || titleLower.includes('bird flu') || titleLower.includes('h5n1') || titleLower.includes('h5n8')) {
        return 'avian_influenza';
    }
    if (titleLower.includes('african swine fever') || titleLower.includes('asf')) {
        return 'african_swine_fever';
    }
    if (titleLower.includes('newcastle')) {
        return 'newcastle_disease';
    }
    if (titleLower.includes('foot and mouth') || titleLower.includes('fmd')) {
        return 'foot_mouth';
    }

    return 'avian_influenza'; // Default
};

/**
 * Extract country from ProMED title
 * Titles usually end with country name in parentheses or after dash
 */
const extractCountry = (title: string): string => {
    // Try to extract country from parentheses
    const match = title.match(/\(([^)]+)\)$/);
    if (match) {
        return match[1];
    }

    // Try to extract from last part after dash
    const parts = title.split(' - ');
    if (parts.length > 1) {
        return parts[parts.length - 1].trim();
    }

    return 'Unknown';
};

/**
 * Simple geocoding using country capitals
 * In production, use a proper geocoding service
 */
const geocodeCountry = (country: string): { lat: number; lng: number } | null => {
    const countryCoordinates: Record<string, { lat: number; lng: number }> = {
        'India': { lat: 20.5937, lng: 78.9629 },
        'China': { lat: 35.8617, lng: 104.1954 },
        'USA': { lat: 37.0902, lng: -95.7129 },
        'UK': { lat: 55.3781, lng: -3.4360 },
        'Germany': { lat: 51.1657, lng: 10.4515 },
        'France': { lat: 46.2276, lng: 2.2137 },
        'Italy': { lat: 41.8719, lng: 12.5674 },
        'Spain': { lat: 40.4637, lng: -3.7492 },
        'Brazil': { lat: -14.2350, lng: -51.9253 },
        'Australia': { lat: -25.2744, lng: 133.7751 },
        'Japan': { lat: 36.2048, lng: 138.2529 },
        'South Korea': { lat: 35.9078, lng: 127.7669 },
        'Vietnam': { lat: 14.0583, lng: 108.2772 },
        'Thailand': { lat: 15.8700, lng: 100.9925 },
        'Indonesia': { lat: -0.7893, lng: 113.9213 },
        'Philippines': { lat: 12.8797, lng: 121.7740 },
        'Bangladesh': { lat: 23.6850, lng: 90.3563 },
        'Pakistan': { lat: 30.3753, lng: 69.3451 },
        'Nigeria': { lat: 9.0820, lng: 8.6753 },
        'South Africa': { lat: -30.5595, lng: 22.9375 },
        'Egypt': { lat: 26.8206, lng: 30.8025 },
        'Kenya': { lat: -0.0236, lng: 37.9062 },
        'Mexico': { lat: 23.6345, lng: -102.5528 },
        'Canada': { lat: 56.1304, lng: -106.3468 },
        'Russia': { lat: 61.5240, lng: 105.3188 },
    };

    // Try exact match first
    if (countryCoordinates[country]) {
        return countryCoordinates[country];
    }

    // Try partial match
    for (const [key, value] of Object.entries(countryCoordinates)) {
        if (country.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(country.toLowerCase())) {
            return value;
        }
    }

    return null;
};

/**
 * Sync ProMED reports to database
 */
export const syncProMEDData = async () => {
    try {
        console.log('[ProMED] Starting sync...');

        const reports = await fetchProMEDReports();

        if (reports.length === 0) {
            console.log('[ProMED] No reports found');
            return { synced: 0, skipped: 0, errors: 0 };
        }

        let synced = 0;
        let skipped = 0;
        let errors = 0;

        for (const report of reports.slice(0, 20)) { // Limit to 20 most recent
            try {
                const diseaseType = extractDiseaseType(report.title);
                const country = extractCountry(report.title);

                // Use advanced geocoding service
                const { geocodeWithGoogle } = await import('./geocoding.service');
                let coords = await geocodeWithGoogle(country);

                // Fallback to simple geocoding if Google Maps fails
                if (!coords) {
                    const simpleCoords = geocodeCountry(country);
                    if (!simpleCoords) {
                        console.log(`[ProMED] Skipping - no coordinates for: ${country}`);
                        skipped++;
                        continue;
                    }
                    coords = {
                        latitude: simpleCoords.lat,
                        longitude: simpleCoords.lng,
                    };
                }

                // Check if already exists (by title or link)
                const existing = await prisma.outbreak.findFirst({
                    where: {
                        OR: [
                            { name: { contains: report.title.substring(0, 50) } },
                        ],
                    },
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // Create outbreak record
                await prisma.outbreak.create({
                    data: {
                        name: report.title.substring(0, 100), // Limit length
                        type: diseaseType,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        severity: 'medium', // Default, can be enhanced with NLP
                        date: new Date(report.pubDate),
                        affectedAnimals: 0, // ProMED doesn't always provide this
                        riskRadius: 30,
                    },
                });

                synced++;
                console.log(`[ProMED] Synced: ${report.title.substring(0, 60)}...`);
            } catch (err) {
                errors++;
                console.error(`[ProMED] Error processing report:`, err);
            }
        }

        console.log(`[ProMED] Sync complete. Synced: ${synced}, Skipped: ${skipped}, Errors: ${errors}`);
        return { synced, skipped, errors };
    } catch (error) {
        console.error('[ProMED] Fatal error during sync:', error);
        throw error;
    }
};
