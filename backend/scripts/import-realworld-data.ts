/**
 * Real-World Data Importer for SIH 2025
 * 
 * This script imports ONLY real-world data provided by the user in JSON format.
 * No synthetic data generation - all data must come from official sources.
 * 
 * Supported data sources:
 * 1. ASF Mortality Data (data.gov.in)
 * 2. Livestock Census Data
 * 3. DAHD Surveillance Data
 * 4. Any other government/research data in JSON format
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// DATA IMPORT FUNCTIONS
// ============================================================================

/**
 * Import ASF Mortality Data from JSON
 * Expected format: Array of { state, year, deaths, culled, ... }
 */
async function importASFMortalityData(jsonPath: string) {
    console.log('\n📊 Importing ASF Mortality Data...');
    console.log(`Source: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
        console.log('  ⚠️  File not found. Skipping...');
        return { imported: 0, skipped: 0 };
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`  Found ${Array.isArray(data) ? data.length : Object.keys(data).length} state records`);

    let imported = 0;
    let skipped = 0;

    const records = Array.isArray(data) ? data : [data];

    for (const record of records) {
        try {
            const state = record.state || record['State/ UT'] || record.State || record.location;

            if (!state) {
                skipped++;
                continue;
            }

            // Get coordinates for the state
            const coords = getStateCoordinates(state);

            // Process each year's data
            const years = [
                { year: 2020, died: 'died', culled: 'culled' },
                { year: 2021, died: 'died', culled: 'culled' },
                { year: 2022, died: 'died', culled: 'culled' },
                { year: 2023, died: 'died', culled: 'culled' }
            ];

            for (const yearData of years) {
                // Try different field name formats
                const diedKey = `${yearData.year}_died` in record ? `${yearData.year}_died` :
                    `${yearData.year} - Died` in record ? `${yearData.year} - Died` :
                        null;

                const culledKey = `${yearData.year}_culled` in record ? `${yearData.year}_culled` :
                    `${yearData.year} - Culled` in record ? `${yearData.year} - Culled` :
                        null;

                const deaths = diedKey ? parseInt(record[diedKey] || '0') : 0;
                const culled = culledKey ? parseInt(record[culledKey] || '0') : 0;

                if (deaths === 0 && culled === 0) {
                    continue; // Skip years with no data
                }

                // Create outbreak record for this year
                await prisma.outbreak.create({
                    data: {
                        name: `ASF - ${state} (${yearData.year})`,
                        type: 'african_swine_fever',
                        latitude: coords.lat + (Math.random() - 0.5) * 0.2,
                        longitude: coords.lng + (Math.random() - 0.5) * 0.2,
                        severity: calculateSeverity(deaths + culled),
                        date: new Date(`${yearData.year}-12-31`),
                        affectedAnimals: deaths + culled,
                        riskRadius: calculateRiskRadius(deaths + culled),
                    }
                });

                imported++;
                console.log(`  ✓ ${state} (${yearData.year}): ${deaths} died, ${culled} culled = ${deaths + culled} total`);
            }

        } catch (error: any) {
            console.error(`  ✗ Error importing ${record.state}:`, error.message);
            skipped++;
        }
    }

    console.log(`\n  Summary: ${imported} outbreak records imported from ${records.length} states`);
    return { imported, skipped };
}

/**
 * Import Livestock Census Data from JSON
 * Expected format: Array of { state, district, pigs, poultry, ... }
 */
async function importLivestockCensusData(jsonPath: string) {
    console.log('\n📊 Importing Livestock Census Data...');
    console.log(`Source: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
        console.log('  ⚠️  File not found. Skipping...');
        return { imported: 0, skipped: 0 };
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`  Found ${Array.isArray(data) ? data.length : Object.keys(data).length} records`);

    // Store census data for reference (can be used for analytics)
    const censusDataPath = path.join(__dirname, '../../data/processed/livestock_census_imported.json');
    fs.writeFileSync(censusDataPath, JSON.stringify(data, null, 2));

    console.log(`  ✓ Census data saved to: ${censusDataPath}`);
    console.log(`  ℹ️  This data can be used for population density analysis`);

    return { imported: 1, skipped: 0 };
}

/**
 * Import DAHD Surveillance Data from JSON
 * Expected format: Array of { disease, location, date, cases, ... }
 */
async function importDAHDSurveillanceData(jsonPath: string) {
    console.log('\n📊 Importing DAHD Surveillance Data...');
    console.log(`Source: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
        console.log('  ⚠️  File not found. Skipping...');
        return { imported: 0, skipped: 0 };
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`  Found ${Array.isArray(data) ? data.length : Object.keys(data).length} records`);

    let imported = 0;
    let skipped = 0;

    const records = Array.isArray(data) ? data : [data];

    for (const record of records) {
        try {
            const disease = record.disease || record.Disease || record.type;
            const location = record.location || record.Location || record.state || record.State;
            const date = record.date || record.Date || record.reportDate;
            const cases = parseInt(record.cases || record.Cases || record.affected || '0');

            if (!disease || !location || cases === 0) {
                skipped++;
                continue;
            }

            const coords = getStateCoordinates(location);
            const diseaseType = mapDiseaseType(disease);

            await prisma.outbreak.create({
                data: {
                    name: `${disease} - ${location}`,
                    type: diseaseType,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    severity: calculateSeverity(cases),
                    date: new Date(date),
                    affectedAnimals: cases,
                    riskRadius: calculateRiskRadius(cases),
                }
            });

            imported++;
            console.log(`  ✓ Imported: ${disease} in ${location} - ${cases} cases`);

        } catch (error: any) {
            console.error(`  ✗ Error importing record:`, error.message);
            skipped++;
        }
    }

    console.log(`\n  Summary: ${imported} imported, ${skipped} skipped`);
    return { imported, skipped };
}

/**
 * Import Custom Farm Data from JSON
 * Expected format: Array of farm objects with biosecurity data
 */
async function importCustomFarmData(jsonPath: string, userId: string) {
    console.log('\n📊 Importing Custom Farm Data...');
    console.log(`Source: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
        console.log('  ⚠️  File not found. Skipping...');
        return { imported: 0, skipped: 0 };
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`  Found ${Array.isArray(data) ? data.length : Object.keys(data).length} records`);

    let imported = 0;
    let skipped = 0;

    const records = Array.isArray(data) ? data : [data];

    for (const record of records) {
        try {
            // Extract farm details (flexible field names)
            const farmName = record.name || record.farmName || record.farm_name || `Farm ${imported + 1}`;
            const location = record.location || record.state || record.address || 'India';
            const latitude = parseFloat(record.latitude || record.lat || '0');
            const longitude = parseFloat(record.longitude || record.lng || record.lon || '0');
            const livestockType = record.livestockType || record.type || record.farm_type || 'Mixed';
            const animalCount = parseInt(record.animalCount || record.animals || record.population || '0');

            // Create farm
            await prisma.farm.create({
                data: {
                    name: farmName,
                    registrationNumber: record.registrationNumber || record.id || `FARM-${Date.now()}-${imported}`,
                    location: location,
                    latitude: latitude || null,
                    longitude: longitude || null,
                    size: parseFloat(record.size || record.area || '5'),
                    sizeUnit: record.sizeUnit || 'acres',
                    livestockType: capitalizeFirst(livestockType),
                    animalCount: animalCount || null,
                    establishmentDate: record.establishmentDate ? new Date(record.establishmentDate) : null,
                    infrastructure: record.infrastructure ? JSON.stringify(record.infrastructure) : null,
                    description: record.description || `Farm in ${location}`,
                    userId: userId,
                }
            });

            imported++;
            console.log(`  ✓ Imported: ${farmName} (${livestockType})`);

        } catch (error: any) {
            console.error(`  ✗ Error importing farm:`, error.message);
            skipped++;
        }
    }

    console.log(`\n  Summary: ${imported} imported, ${skipped} skipped`);
    return { imported, skipped };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStateCoordinates(state: string): { lat: number; lng: number } {
    const stateCoords: { [key: string]: { lat: number; lng: number } } = {
        // Northeast India
        'Nagaland': { lat: 26.1584, lng: 94.5624 },
        'Mizoram': { lat: 23.1645, lng: 92.9376 },
        'Meghalaya': { lat: 25.4670, lng: 91.3662 },
        'Assam': { lat: 26.2006, lng: 92.9376 },
        'Manipur': { lat: 24.6637, lng: 93.9063 },
        'Tripura': { lat: 23.9408, lng: 91.9882 },
        'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },

        // East India
        'West Bengal': { lat: 22.9868, lng: 87.8550 },
        'Jharkhand': { lat: 23.6102, lng: 85.2799 },
        'Bihar': { lat: 25.0961, lng: 85.3131 },
        'Odisha': { lat: 20.9517, lng: 85.0985 },

        // South India
        'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
        'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
        'Telangana': { lat: 18.1124, lng: 79.0193 },
        'Karnataka': { lat: 15.3173, lng: 75.7139 },
        'Kerala': { lat: 10.8505, lng: 76.2711 },

        // West India
        'Maharashtra': { lat: 19.7515, lng: 75.7139 },
        'Gujarat': { lat: 22.2587, lng: 71.1924 },
        'Goa': { lat: 15.2993, lng: 74.1240 },

        // North India
        'Punjab': { lat: 31.1471, lng: 75.3412 },
        'Haryana': { lat: 29.0588, lng: 76.0856 },
        'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
        'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
        'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
        'Jammu and Kashmir': { lat: 33.7782, lng: 76.5762 },

        // Central India
        'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
        'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
    };

    // Try exact match first
    if (stateCoords[state]) {
        return stateCoords[state];
    }

    // Try case-insensitive match
    const stateKey = Object.keys(stateCoords).find(
        key => key.toLowerCase() === state.toLowerCase()
    );

    if (stateKey) {
        return stateCoords[stateKey];
    }

    // Default to center of India
    console.log(`  ⚠️  Unknown state: ${state}, using default coordinates`);
    return { lat: 23.0, lng: 80.0 };
}

function calculateSeverity(affectedAnimals: number): string {
    if (affectedAnimals > 1000) return 'high';
    if (affectedAnimals > 100) return 'medium';
    return 'low';
}

function calculateRiskRadius(affectedAnimals: number): number {
    if (affectedAnimals > 1000) return 50;
    if (affectedAnimals > 500) return 35;
    if (affectedAnimals > 100) return 25;
    return 15;
}

function mapDiseaseType(disease: string): string {
    const diseaseMap: { [key: string]: string } = {
        'ASF': 'african_swine_fever',
        'African Swine Fever': 'african_swine_fever',
        'Avian Influenza': 'avian_influenza',
        'Bird Flu': 'avian_influenza',
        'H5N1': 'avian_influenza',
        'Newcastle Disease': 'newcastle_disease',
        'FMD': 'foot_and_mouth_disease',
        'Foot and Mouth Disease': 'foot_and_mouth_disease',
        'CSF': 'classical_swine_fever',
        'Classical Swine Fever': 'classical_swine_fever',
    };

    return diseaseMap[disease] || disease.toLowerCase().replace(/\s+/g, '_');
}

function extractYear(record: any): string {
    // Try to extract year from various fields
    if (record.year) return record.year.toString();
    if (record.Year) return record.Year.toString();
    if (record.date) return new Date(record.date).getFullYear().toString();
    if (record.Date) return new Date(record.Date).getFullYear().toString();
    return new Date().getFullYear().toString();
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================================================
// MAIN IMPORT FUNCTION
// ============================================================================

async function createDemoUser() {
    console.log('\n👤 Checking for demo user...');

    const existingUser = await prisma.user.findUnique({
        where: { email: 'admin@farmsecure.com' }
    });

    if (existingUser) {
        console.log('  ✓ Demo user already exists');
        return existingUser;
    }

    // Note: You'll need to hash the password properly
    // For now, using a placeholder - replace with actual bcrypt hash
    const user = await prisma.user.create({
        data: {
            email: 'admin@farmsecure.com',
            password: '$2b$10$.UnbxFXwGC66uhCRDhqTYO7AXBXxN8bu1ZFVLNUifWYqfP1z10iL6', // Hash for 'password123'
            firstName: 'Admin',
            lastName: 'User',
            phone: '+91-9876543210',
            role: 'ADMIN',
            isVerified: true,
            language: 'en',
            address: 'India',
            jobTitle: 'System Administrator',
            emailNotifications: true,
            smsNotifications: true,
            whatsappNotifications: false,
            shareData: true,
        }
    });

    console.log('  ✓ Demo user created:', user.email);
    return user;
}

async function generateStatistics() {
    console.log('\n' + '='.repeat(70));
    console.log('DATABASE STATISTICS');
    console.log('='.repeat(70));

    const totalFarms = await prisma.farm.count();
    const totalOutbreaks = await prisma.outbreak.count();

    // Outbreak breakdown by type
    const outbreaksByType = await prisma.outbreak.groupBy({
        by: ['type'],
        _count: true,
    });

    // Outbreak breakdown by severity
    const outbreaksBySeverity = await prisma.outbreak.groupBy({
        by: ['severity'],
        _count: true,
    });

    console.log(`\n📊 Farms: ${totalFarms}`);

    if (totalFarms > 0) {
        const pigFarms = await prisma.farm.count({ where: { livestockType: 'Pig' } });
        const poultryFarms = await prisma.farm.count({ where: { livestockType: 'Poultry' } });
        const mixedFarms = await prisma.farm.count({ where: { livestockType: 'Mixed' } });

        console.log(`  - Pig Farms: ${pigFarms}`);
        console.log(`  - Poultry Farms: ${poultryFarms}`);
        console.log(`  - Mixed Farms: ${mixedFarms}`);
    }

    console.log(`\n🦠 Outbreaks: ${totalOutbreaks}`);

    if (totalOutbreaks > 0) {
        console.log('\n  By Disease Type:');
        outbreaksByType.forEach(({ type, _count }) => {
            console.log(`    - ${type}: ${_count}`);
        });

        console.log('\n  By Severity:');
        outbreaksBySeverity.forEach(({ severity, _count }) => {
            console.log(`    - ${severity}: ${_count}`);
        });
    }

    console.log('\n' + '='.repeat(70));
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║        SIH 2025 - Real-World Data Import System                   ║');
    console.log('║        Digital Farm Management Portal for Biosecurity              ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');

    try {
        // Create demo user
        const user = await createDemoUser();

        // Define data file paths
        const dataDir = path.join(__dirname, '../../data/raw');

        const dataSources = {
            asfMortality: path.join(dataDir, 'asf_mortality_data.json'),
            livestockCensus: path.join(dataDir, 'livestock_census_data.json'),
            dahdSurveillance: path.join(dataDir, 'dahd_surveillance_data.json'),
            customFarms: path.join(dataDir, 'custom_farm_data.json'),
        };

        console.log('\n📂 Looking for data files in:', dataDir);
        console.log('\nExpected files:');
        console.log('  1. asf_mortality_data.json       - ASF outbreak data');
        console.log('  2. livestock_census_data.json    - Census/population data');
        console.log('  3. dahd_surveillance_data.json   - DAHD surveillance data');
        console.log('  4. custom_farm_data.json         - Custom farm records');
        console.log('\n' + '─'.repeat(70));

        let totalImported = 0;
        let totalSkipped = 0;

        // Import ASF Mortality Data
        const asfResult = await importASFMortalityData(dataSources.asfMortality);
        totalImported += asfResult.imported;
        totalSkipped += asfResult.skipped;

        // Import Livestock Census Data
        const censusResult = await importLivestockCensusData(dataSources.livestockCensus);
        totalImported += censusResult.imported;
        totalSkipped += censusResult.skipped;

        // Import DAHD Surveillance Data
        const dahdResult = await importDAHDSurveillanceData(dataSources.dahdSurveillance);
        totalImported += dahdResult.imported;
        totalSkipped += dahdResult.skipped;

        // Import Custom Farm Data
        const farmResult = await importCustomFarmData(dataSources.customFarms, user.id);
        totalImported += farmResult.imported;
        totalSkipped += farmResult.skipped;

        // Generate statistics
        await generateStatistics();

        console.log('\n✅ IMPORT COMPLETE!');
        console.log(`   Total records imported: ${totalImported}`);
        console.log(`   Total records skipped: ${totalSkipped}`);

        if (totalImported === 0) {
            console.log('\n⚠️  No data was imported!');
            console.log('\n📝 Instructions:');
            console.log('   1. Download your data from government/research sources');
            console.log('   2. Convert to JSON format');
            console.log('   3. Save files in: data/raw/');
            console.log('   4. Run this script again');
            console.log('\n   See DATA_FORMAT_GUIDE.md for JSON format examples');
        } else {
            console.log('\n🎉 Your real-world data is now in the database!');
            console.log('\nNext steps:');
            console.log('   1. Start backend: cd backend && npm run dev');
            console.log('   2. Start frontend: cd frontend && npm run dev');
            console.log('   3. Login with: admin@farmsecure.com');
            console.log('   4. View your data in the dashboard');
        }

    } catch (error) {
        console.error('\n❌ Error during import:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
