import axios from 'axios';

/**
 * Weather Service
 * 
 * Fetches real-time weather data using OpenWeatherMap API.
 * Provides critical weather indices for biosecurity:
 * - Temperature & Humidity (affects pathogen survival)
 * - Wind Speed & Direction (affects airborne transmission)
 * - Precipitation (affects runoff and contamination spread)
 */

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    description: string;
    icon: string;
    precipitation: number;
    biosecurityRisk: 'low' | 'medium' | 'high';
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch current weather for given coordinates
 */
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    if (!OPENWEATHER_API_KEY) {
        console.warn('[Weather] API Key not configured');
        return null;
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;

        // Calculate biosecurity risk based on weather
        // Simplified Logic: 
        // - High Humidity + Moderate Temp = High Pathogen Survival
        // - High Wind = Airborne dispersal risk
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        let risk: 'low' | 'medium' | 'high' = 'low';

        if (humidity > 80 || windSpeed > 10) {
            risk = 'high';
        } else if (humidity > 60 || windSpeed > 5) {
            risk = 'medium';
        }

        return {
            temp: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            windDeg: data.wind.deg,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            precipitation: data.rain ? data.rain['1h'] || 0 : 0,
            biosecurityRisk: risk
        };
    } catch (error) {
        console.error('[Weather] Failed to fetch weather:', error);
        return null;
    }
};
