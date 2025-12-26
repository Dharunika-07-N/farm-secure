/**
 * Import Synthetic Farm Data into PostgreSQL Database
 * SIH 2025 - Digital Farm Management Portal
 * 
 * This script imports the generated synthetic farm data into the database,
 * creating farms with realistic biosecurity metrics based on research data.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface SyntheticFarmData {
    farm_id: string;
    farm_name: string;
    farm_type: 'pig' | 'poultry';
    state: string;
    district_type?: string;
    latitude: number;
    longitude: number;
    biosecurity_score: number;
    risk_level: string;
    owner_age: number;
    owner_gender: string;
    education_level: string;
    pig_population?: number;
    bird_population?: number;
    poultry_category?: string;
    asf_awareness?: boolean;
    swill_feeding?: boolean;
    wild_boar_hunting?: boolean;
    has_farm_fencing?: string;
    uses_chlorinated_water?: string;
    received_training?: boolean;
    last_inspection: string;
    created_at: string;
    [key: string]: any;
}

async function createDemoUser() {
    console.log('Creating demo admin user...');

    // Check if demo user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: 'demo@farmsecure.com' }
    });

    if (existingUser) {
        console.log('  ✓ Demo user already exists');
        return existingUser;
    }

    // Create demo user (password: Demo@123)
    const hashedPassword = '$2b$10$YourHashedPasswordHere'; // You'll need to hash this properly

    const user = await prisma.user.create({
        data: {
            email: 'demo@farmsecure.com',
            password: hashedPassword,
            firstName: 'Demo',
            lastName: 'Admin',
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

async function importSyntheticFarms(csvPath: string, userId: string) {
    console.log(`\nImporting synthetic farms from: ${csvPath}`);

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records: SyntheticFarmData[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
            // Convert string booleans to actual booleans
            if (value === 'True' || value === 'true') return true;
            if (value === 'False' || value === 'false') return false;
            // Convert numeric strings to numbers
            if (context.column === 'latitude' || context.column === 'longitude' ||
                context.column === 'biosecurity_score' || context.column === 'owner_age' ||
                context.column === 'pig_population' || context.column === 'bird_population') {
                return parseFloat(value);
            }
            return value;
        }
    });

    console.log(`  Found ${records.length} farms to import`);

    let imported = 0;
    let skipped = 0;

    for (const record of records) {
        try {
            // Determine livestock type and count
            const livestockType = record.farm_type === 'pig' ? 'Pig' : 'Poultry';
            const animalCount = record.farm_type === 'pig'
                ? (record.pig_population || 0)
                : (record.bird_population || 0);

            // Create farm description with biosecurity info
            const description = generateFarmDescription(record);

            // Create infrastructure JSON
            const infrastructure = generateInfrastructureData(record);

            await prisma.farm.create({
                data: {
                    name: record.farm_name,
                    registrationNumber: record.farm_id,
                    location: `${record.state}, India`,
                    latitude: record.latitude,
                    longitude: record.longitude,
                    size: record.farm_type === 'pig' ? 2.5 : 5.0, // Default sizes
                    sizeUnit: 'acres',
                    livestockType: livestockType,
                    animalCount: Math.floor(animalCount),
                    establishmentDate: new Date(record.last_inspection),
                    infrastructure: JSON.stringify(infrastructure),
                    description: description,
                    userId: userId,
                }
            });

            imported++;

            if (imported % 100 === 0) {
                console.log(`  Imported ${imported} farms...`);
            }

        } catch (error: any) {
            console.error(`  ✗ Error importing farm ${record.farm_id}:`, error.message);
            skipped++;
        }
    }

    console.log(`\n  ✓ Import complete:`);
    console.log(`    - Successfully imported: ${imported} farms`);
    console.log(`    - Skipped: ${skipped} farms`);

    return { imported, skipped };
}

function generateFarmDescription(record: SyntheticFarmData): string {
    const parts = [];

    parts.push(`${record.farm_type === 'pig' ? 'Pig' : 'Poultry'} farm located in ${record.state}.`);

    if (record.biosecurity_score) {
        parts.push(`Biosecurity Score: ${record.biosecurity_score}/100 (${record.risk_level} Risk).`);
    }

    if (record.farm_type === 'pig') {
        if (record.asf_awareness) {
            parts.push('Owner is aware of African Swine Fever risks.');
        }
        if (record.swill_feeding) {
            parts.push('Practices swill feeding.');
        }
    } else {
        if (record.received_training) {
            parts.push('Received biosecurity training.');
        }
        if (record.poultry_category) {
            parts.push(`Type: ${record.poultry_category}.`);
        }
    }

    parts.push(`Owner: ${record.owner_gender}, ${record.owner_age} years, ${record.education_level} education.`);

    return parts.join(' ');
}

function generateInfrastructureData(record: SyntheticFarmData): any {
    const infrastructure: any = {
        biosecurity_score: record.biosecurity_score,
        risk_level: record.risk_level,
        owner_demographics: {
            age: record.owner_age,
            gender: record.owner_gender,
            education: record.education_level,
        }
    };

    if (record.farm_type === 'pig') {
        infrastructure.pig_specific = {
            district_type: record.district_type,
            asf_awareness: record.asf_awareness,
            swill_feeding: record.swill_feeding,
            wild_boar_hunting: record.wild_boar_hunting,
            population: record.pig_population,
        };
    } else {
        infrastructure.poultry_specific = {
            category: record.poultry_category,
            population: record.bird_population,
            received_training: record.received_training,
            has_fencing: record.has_farm_fencing,
            chlorinated_water: record.uses_chlorinated_water,
        };
    }

    return infrastructure;
}

async function importASFMortalityData(csvPath: string) {
    console.log(`\nImporting ASF mortality data from: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
        console.log('  ⚠ ASF data file not found. Skipping...');
        console.log('  → Please download from: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023');
        return { imported: 0, skipped: 0 };
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`  Found ${records.length} ASF outbreak records`);

    let imported = 0;

    for (const record of records) {
        try {
            // Parse state and deaths
            const state = record['State/ UT'] || record['State'] || record['state'];
            const deaths2020 = parseInt(record['2020 - Died'] || '0');
            const deaths2021 = parseInt(record['2021 - Died'] || '0');
            const culled2021 = parseInt(record['2021 - Culled'] || '0');

            if (!state || (deaths2020 === 0 && deaths2021 === 0)) {
                continue; // Skip if no data
            }

            // Get approximate coordinates for the state (you'll need a geocoding service for accuracy)
            const coords = getStateCoordinates(state);

            // Create outbreak records
            if (deaths2020 > 0) {
                await prisma.outbreak.create({
                    data: {
                        name: `ASF Outbreak - ${state} (2020)`,
                        type: 'african_swine_fever',
                        latitude: coords.lat,
                        longitude: coords.lng,
                        severity: calculateSeverity(deaths2020),
                        date: new Date('2020-12-31'),
                        affectedAnimals: deaths2020,
                        riskRadius: calculateRiskRadius(deaths2020),
                    }
                });
                imported++;
            }

            if (deaths2021 > 0 || culled2021 > 0) {
                await prisma.outbreak.create({
                    data: {
                        name: `ASF Outbreak - ${state} (2021)`,
                        type: 'african_swine_fever',
                        latitude: coords.lat + (Math.random() - 0.5) * 0.5, // Slight variation
                        longitude: coords.lng + (Math.random() - 0.5) * 0.5,
                        severity: calculateSeverity(deaths2021 + culled2021),
                        date: new Date('2021-12-31'),
                        affectedAnimals: deaths2021 + culled2021,
                        riskRadius: calculateRiskRadius(deaths2021 + culled2021),
                    }
                });
                imported++;
            }

        } catch (error: any) {
            console.error(`  ✗ Error importing ASF data for ${record['State/ UT']}:`, error.message);
        }
    }

    console.log(`  ✓ Imported ${imported} ASF outbreak records`);
    return { imported, skipped: 0 };
}

function getStateCoordinates(state: string): { lat: number; lng: number } {
    // Approximate coordinates for Indian states (you should use a proper geocoding service)
    const stateCoords: { [key: string]: { lat: number; lng: number } } = {
        'Nagaland': { lat: 26.1584, lng: 94.5624 },
        'Mizoram': { lat: 23.1645, lng: 92.9376 },
        'Meghalaya': { lat: 25.4670, lng: 91.3662 },
        'Assam': { lat: 26.2006, lng: 92.9376 },
        'Manipur': { lat: 24.6637, lng: 93.9063 },
        'Tripura': { lat: 23.9408, lng: 91.9882 },
        'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
        'West Bengal': { lat: 22.9868, lng: 87.8550 },
        'Jharkhand': { lat: 23.6102, lng: 85.2799 },
        'Bihar': { lat: 25.0961, lng: 85.3131 },
    };

    return stateCoords[state] || { lat: 23.0, lng: 80.0 }; // Default to center of India
}

function calculateSeverity(affectedAnimals: number): string {
    if (affectedAnimals > 1000) return 'high';
    if (affectedAnimals > 100) return 'medium';
    return 'low';
}

function calculateRiskRadius(affectedAnimals: number): number {
    // Risk radius in km based on affected animals
    if (affectedAnimals > 1000) return 50;
    if (affectedAnimals > 500) return 35;
    if (affectedAnimals > 100) return 25;
    return 15;
}

async function generateStatistics() {
    console.log('\n' + '='.repeat(60));
    console.log('DATABASE STATISTICS');
    console.log('='.repeat(60));

    const totalFarms = await prisma.farm.count();
    const pigFarms = await prisma.farm.count({ where: { livestockType: 'Pig' } });
    const poultryFarms = await prisma.farm.count({ where: { livestockType: 'Poultry' } });
    const totalOutbreaks = await prisma.outbreak.count();

    console.log(`\nTotal Farms: ${totalFarms}`);
    console.log(`  - Pig Farms: ${pigFarms}`);
    console.log(`  - Poultry Farms: ${poultryFarms}`);
    console.log(`\nTotal Outbreak Records: ${totalOutbreaks}`);

    console.log('\n' + '='.repeat(60));
}

async function main() {
    console.log('SIH 2025 - Farm Data Import Script');
    console.log('===================================\n');

    try {
        // Create demo user
        const user = await createDemoUser();

        // Import synthetic farms
        const syntheticFarmsPath = path.join(__dirname, '../../data/processed/synthetic_farms_1000.csv');

        if (fs.existsSync(syntheticFarmsPath)) {
            await importSyntheticFarms(syntheticFarmsPath, user.id);
        } else {
            console.log('⚠ Synthetic farms file not found!');
            console.log('  Please run: python data/scripts/generate_synthetic_farms.py');
        }

        // Import ASF mortality data (if available)
        const asfDataPath = path.join(__dirname, '../../data/raw/asf_mortality_2020_2023.csv');
        await importASFMortalityData(asfDataPath);

        // Generate statistics
        await generateStatistics();

        console.log('\n✓ Data import complete!');
        console.log('\nNext steps:');
        console.log('  1. Start the backend: cd backend && npm run dev');
        console.log('  2. Login with: demo@farmsecure.com');
        console.log('  3. View farms in the dashboard');

    } catch (error) {
        console.error('Error during import:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
