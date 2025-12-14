import { Client } from '@googlemaps/google-maps-services-js';
import fetch from 'node-fetch';

/**
 * Geocoding Service
 * 
 * Provides accurate geocoding using:
 * - Google Maps Geocoding API (primary)
 * - Nominatim OpenStreetMap (free fallback)
 * - Cached coordinates for common locations
 */

const googleMapsClient = new Client({});

interface Coordinates {
    latitude: number;
    longitude: number;
    formatted_address?: string;
    accuracy?: 'exact' | 'city' | 'country';
}

/**
 * Geocode location using Google Maps API
 */
export const geocodeWithGoogle = async (location: string): Promise<Coordinates | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('[Geocoding] Google Maps API key not configured, using fallback');
        return geocodeWithNominatim(location);
    }

    try {
        const response = await googleMapsClient.geocode({
            params: {
                address: location,
                key: apiKey,
            },
        });

        if (response.data.results.length > 0) {
            const result = response.data.results[0];
            return {
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng,
                formatted_address: result.formatted_address,
                accuracy: determineAccuracy(result.types),
            };
        }

        return null;
    } catch (error) {
        console.error('[Geocoding] Google Maps error:', error);
        return geocodeWithNominatim(location);
    }
};

/**
 * Geocode using free Nominatim API (OpenStreetMap)
 */
export const geocodeWithNominatim = async (location: string): Promise<Coordinates | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'Farm-Secure/1.0',
                },
            }
        );

        const data = await response.json();

        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                formatted_address: data[0].display_name,
                accuracy: 'city',
            };
        }

        return null;
    } catch (error) {
        console.error('[Geocoding] Nominatim error:', error);
        return null;
    }
};

/**
 * Determine accuracy level from Google Maps result types
 */
const determineAccuracy = (types: string[]): 'exact' | 'city' | 'country' => {
    if (types.includes('street_address') || types.includes('premise')) {
        return 'exact';
    }
    if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        return 'city';
    }
    return 'country';
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return reverseGeocodeWithNominatim(lat, lng);
    }

    try {
        const response = await googleMapsClient.reverseGeocode({
            params: {
                latlng: { lat, lng },
                key: apiKey,
            },
        });

        if (response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        }

        return null;
    } catch (error) {
        console.error('[Geocoding] Reverse geocode error:', error);
        return reverseGeocodeWithNominatim(lat, lng);
    }
};

/**
 * Reverse geocode using Nominatim
 */
const reverseGeocodeWithNominatim = async (lat: number, lng: number): Promise<string | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
                headers: {
                    'User-Agent': 'Farm-Secure/1.0',
                },
            }
        );

        const data = await response.json();
        return data.display_name || null;
    } catch (error) {
        console.error('[Geocoding] Reverse geocode error:', error);
        return null;
    }
};

/**
 * Batch geocode multiple locations (with rate limiting)
 */
export const batchGeocode = async (locations: string[]): Promise<Map<string, Coordinates>> => {
    const results = new Map<string, Coordinates>();

    for (const location of locations) {
        const coords = await geocodeWithGoogle(location);
        if (coords) {
            results.set(location, coords);
        }

        // Rate limiting: wait 200ms between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    return results;
};

/**
 * Get coordinates for a farm location
 * Tries multiple strategies for best accuracy
 */
export const geocodeFarmLocation = async (farmLocation: string): Promise<Coordinates | null> => {
    // Try Google Maps first for best accuracy
    let coords = await geocodeWithGoogle(farmLocation);

    if (coords && coords.accuracy === 'exact') {
        return coords;
    }

    // If not exact, try adding "farm" to the query
    coords = await geocodeWithGoogle(`${farmLocation} farm`);

    if (coords) {
        return coords;
    }

    // Fallback to Nominatim
    return await geocodeWithNominatim(farmLocation);
};
