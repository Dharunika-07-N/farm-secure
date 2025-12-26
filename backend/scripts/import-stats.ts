import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data 1: Avian Influenza Stats (State/UT, Year, Bird_Deaths, Outbreaks_Reported, Poultry_Culled, Virus_Strain)
const aiStats = [
    { state: 'Kerala', year: 2021, deaths: 85000, outbreaks: 24, culled: 420000, strain: 'H5N1' },
    { state: 'Kerala', year: 2022, deaths: 102000, outbreaks: 32, culled: 510000, strain: 'H5N1' },
    { state: 'Kerala', year: 2023, deaths: 67000, outbreaks: 18, culled: 335000, strain: 'H5N1' },
    { state: 'Rajasthan', year: 2021, deaths: 54000, outbreaks: 16, culled: 270000, strain: 'H5N8' },
    { state: 'Rajasthan', year: 2022, deaths: 68000, outbreaks: 21, culled: 340000, strain: 'H5N1' },
    { state: 'Rajasthan', year: 2023, deaths: 42000, outbreaks: 12, culled: 210000, strain: 'H5N1' },
    { state: 'Madhya Pradesh', year: 2021, deaths: 38000, outbreaks: 11, culled: 190000, strain: 'H5N8' },
    { state: 'Madhya Pradesh', year: 2022, deaths: 52000, outbreaks: 16, culled: 260000, strain: 'H5N1' },
    { state: 'Madhya Pradesh', year: 2023, deaths: 35000, outbreaks: 10, culled: 175000, strain: 'H5N1' },
    { state: 'Himachal Pradesh', year: 2021, deaths: 45000, outbreaks: 13, culled: 225000, strain: 'H5N1' },
    { state: 'Himachal Pradesh', year: 2022, deaths: 58000, outbreaks: 18, culled: 290000, strain: 'H5N1' },
    { state: 'Himachal Pradesh', year: 2023, deaths: 39000, outbreaks: 12, culled: 195000, strain: 'H5N1' },
    { state: 'Haryana', year: 2021, deaths: 32000, outbreaks: 9, culled: 160000, strain: 'H5N8' },
    { state: 'Haryana', year: 2022, deaths: 45000, outbreaks: 14, culled: 225000, strain: 'H5N1' },
    { state: 'Haryana', year: 2023, deaths: 28000, outbreaks: 8, culled: 140000, strain: 'H5N1' },
    { state: 'Delhi', year: 2021, deaths: 28000, outbreaks: 8, culled: 140000, strain: 'H5N1' },
    { state: 'Delhi', year: 2022, deaths: 38000, outbreaks: 12, culled: 190000, strain: 'H5N1' },
    { state: 'Delhi', year: 2023, deaths: 25000, outbreaks: 7, culled: 125000, strain: 'H5N1' },
    { state: 'Uttar Pradesh', year: 2021, deaths: 42000, outbreaks: 12, culled: 210000, strain: 'H5N8' },
    { state: 'Uttar Pradesh', year: 2022, deaths: 55000, outbreaks: 17, culled: 275000, strain: 'H5N1' },
    { state: 'Uttar Pradesh', year: 2023, deaths: 38000, outbreaks: 11, culled: 190000, strain: 'H5N1' },
    { state: 'Gujarat', year: 2021, deaths: 35000, outbreaks: 10, culled: 175000, strain: 'H5N1' },
    { state: 'Gujarat', year: 2022, deaths: 48000, outbreaks: 15, culled: 240000, strain: 'H5N1' },
    { state: 'Gujarat', year: 2023, deaths: 31000, outbreaks: 9, culled: 155000, strain: 'H5N1' },
    { state: 'Maharashtra', year: 2021, deaths: 29000, outbreaks: 8, culled: 145000, strain: 'H5N8' },
    { state: 'Maharashtra', year: 2022, deaths: 39000, outbreaks: 12, culled: 195000, strain: 'H5N1' },
    { state: 'Maharashtra', year: 2023, deaths: 26000, outbreaks: 7, culled: 130000, strain: 'H5N1' },
    { state: 'West Bengal', year: 2021, deaths: 48000, outbreaks: 14, culled: 240000, strain: 'H5N1' },
    { state: 'West Bengal', year: 2022, deaths: 62000, outbreaks: 19, culled: 310000, strain: 'H5N1' },
    { state: 'West Bengal', year: 2023, deaths: 44000, outbreaks: 13, culled: 220000, strain: 'H5N1' },
];

// Data 2: ASF Stats (State/UT, Year, Deaths, Outbreaks_Reported, Districts_Affected)
const asfStats = [
    { state: 'Assam', year: 2021, deaths: 15420, outbreaks: 42, districts: 18 },
    { state: 'Assam', year: 2022, deaths: 18950, outbreaks: 53, districts: 22 },
    { state: 'Assam', year: 2023, deaths: 12340, outbreaks: 38, districts: 16 },
    { state: 'Meghalaya', year: 2021, deaths: 8920, outbreaks: 28, districts: 10 },
    { state: 'Meghalaya', year: 2022, deaths: 11200, outbreaks: 35, districts: 12 },
    { state: 'Meghalaya', year: 2023, deaths: 7850, outbreaks: 24, districts: 9 },
    { state: 'Nagaland', year: 2021, deaths: 6750, outbreaks: 21, districts: 8 },
    { state: 'Nagaland', year: 2022, deaths: 8420, outbreaks: 27, districts: 10 },
    { state: 'Nagaland', year: 2023, deaths: 5630, outbreaks: 18, districts: 7 },
    { state: 'Manipur', year: 2021, deaths: 4320, outbreaks: 15, districts: 6 },
    { state: 'Manipur', year: 2022, deaths: 6150, outbreaks: 19, districts: 8 },
    { state: 'Manipur', year: 2023, deaths: 4870, outbreaks: 14, districts: 6 },
    { state: 'Mizoram', year: 2021, deaths: 3850, outbreaks: 12, districts: 5 },
    { state: 'Mizoram', year: 2022, deaths: 5240, outbreaks: 16, districts: 7 },
    { state: 'Mizoram', year: 2023, deaths: 3920, outbreaks: 11, districts: 5 },
    { state: 'Tripura', year: 2021, deaths: 5640, outbreaks: 18, districts: 7 },
    { state: 'Tripura', year: 2022, deaths: 7320, outbreaks: 23, districts: 9 },
    { state: 'Tripura', year: 2023, deaths: 6180, outbreaks: 19, districts: 8 },
    { state: 'Arunachal Pradesh', year: 2021, deaths: 2180, outbreaks: 8, districts: 4 },
    { state: 'Arunachal Pradesh', year: 2022, deaths: 3450, outbreaks: 11, districts: 5 },
    { state: 'Arunachal Pradesh', year: 2023, deaths: 2890, outbreaks: 9, districts: 4 },
    { state: 'Sikkim', year: 2021, deaths: 1850, outbreaks: 6, districts: 3 },
    { state: 'Sikkim', year: 2022, deaths: 2640, outbreaks: 8, districts: 4 },
    { state: 'Sikkim', year: 2023, deaths: 1920, outbreaks: 6, districts: 3 },
    { state: 'West Bengal', year: 2021, deaths: 9850, outbreaks: 31, districts: 12 },
    { state: 'West Bengal', year: 2022, deaths: 12450, outbreaks: 39, districts: 15 },
    { state: 'West Bengal', year: 2023, deaths: 8760, outbreaks: 27, districts: 11 },
    { state: 'Kerala', year: 2021, deaths: 3240, outbreaks: 10, districts: 5 },
    { state: 'Kerala', year: 2022, deaths: 4820, outbreaks: 15, districts: 7 },
    { state: 'Kerala', year: 2023, deaths: 3560, outbreaks: 11, districts: 5 },
    { state: 'Karnataka', year: 2021, deaths: 1240, outbreaks: 4, districts: 2 },
    { state: 'Karnataka', year: 2022, deaths: 2150, outbreaks: 7, districts: 3 },
    { state: 'Karnataka', year: 2023, deaths: 1780, outbreaks: 5, districts: 2 },
    { state: 'Punjab', year: 2021, deaths: 850, outbreaks: 3, districts: 2 },
    { state: 'Punjab', year: 2022, deaths: 1320, outbreaks: 4, districts: 2 },
    { state: 'Punjab', year: 2023, deaths: 980, outbreaks: 3, districts: 2 },
];

// Data 3: Risk Factors
const riskFactors = [
    { factor: 'No_Vaccination', asf: 3.2, ai: 3.8 },
    { factor: 'Poor_Visitor_Control', asf: 2.8, ai: 2.5 },
    { factor: 'No_Quarantine_Protocol', asf: 3.5, ai: 3.2 },
    { factor: 'Wildlife_Exposure', asf: 2.9, ai: 3.4 },
    { factor: 'Poor_Sanitation', asf: 2.4, ai: 2.7 },
    { factor: 'Inadequate_Feed_Safety', asf: 2.1, ai: 2.3 },
    { factor: 'No_Disinfection', asf: 2.6, ai: 2.9 },
    { factor: 'High_Herd_Density', asf: 1.8, ai: 2.2 },
    { factor: 'Lack_Veterinary_Access', asf: 2.3, ai: 2.1 },
    { factor: 'Poor_Waste_Management', asf: 2.0, ai: 2.4 },
];

// Data 4: Biosecurity Indicators
const indicators = [
    { id: 1, name: 'visitor_entry_control', weight: 0.95, source: 'PMC10352026', type: 'Both', prev: 0.68 },
    { id: 2, name: 'footwear_disinfection', weight: 0.92, source: 'PMC10352026', type: 'Both', prev: 0.72 },
    { id: 3, name: 'vehicle_disinfection', weight: 0.88, source: 'PMC10352026', type: 'Both', prev: 0.65 },
    { id: 4, name: 'feed_source_biosecurity', weight: 0.90, source: 'PMC10352026', type: 'Both', prev: 0.58 },
    { id: 5, name: 'water_source_quality', weight: 0.85, source: 'PMC10352026', type: 'Both', prev: 0.55 },
    { id: 6, name: 'wild_animal_contact', weight: 0.87, source: 'PMC10352026', type: 'Both', prev: 0.71 },
    { id: 7, name: 'quarantine_new_animals', weight: 0.93, source: 'PMC10352026', type: 'Both', prev: 0.62 },
    { id: 8, name: 'vaccination_compliance', weight: 0.96, source: 'PMC12051024', type: 'Both', prev: 0.48 },
    { id: 9, name: 'sanitation_frequency', weight: 0.89, source: 'PMC12051024', type: 'Both', prev: 0.63 },
    { id: 10, name: 'waste_disposal_method', weight: 0.84, source: 'PMC12051024', type: 'Both', prev: 0.69 },
    { id: 11, name: 'herd_size_management', weight: 0.75, source: 'PMC12051024', type: 'Pig', prev: 0.45 },
    { id: 12, name: 'farm_location_isolation', weight: 0.81, source: 'PMC10352026', type: 'Both', prev: 0.52 },
    { id: 13, name: 'staff_hygiene_training', weight: 0.86, source: 'PMC12051024', type: 'Both', prev: 0.66 },
    { id: 14, name: 'disease_surveillance_active', weight: 0.91, source: 'PMC10352026', type: 'Both', prev: 0.74 },
    { id: 15, name: 'veterinary_visit_frequency', weight: 0.83, source: 'PMC12051024', type: 'Both', prev: 0.59 },
    { id: 16, name: 'record_keeping_digital', weight: 0.72, source: 'PMC12051024', type: 'Both', prev: 0.81 },
    { id: 17, name: 'mortality_reporting_speed', weight: 0.88, source: 'PMC10352026', type: 'Both', prev: 0.70 },
    { id: 18, name: 'neighbor_farm_biosecurity', weight: 0.78, source: 'PMC10352026', type: 'Both', prev: 0.64 },
    { id: 19, name: 'feed_storage_hygiene', weight: 0.79, source: 'PMC12051024', type: 'Poultry', prev: 0.61 },
    { id: 20, name: 'equipment_sterilization', weight: 0.85, source: 'PMC12051024', type: 'Both', prev: 0.67 },
];

async function main() {
    console.log('🚀 Starting Statistics and Risk Data Import...');

    // 1. Import AI Stats
    console.log('\n📊 Importing Avian Influenza Statistics...');
    let aiCount = 0;
    for (const stat of aiStats) {
        await prisma.diseaseStatistic.create({
            data: {
                state: stat.state,
                year: stat.year,
                diseaseType: 'Avian Influenza',
                deaths: stat.deaths,
                outbreaks: stat.outbreaks,
                culled: stat.culled,
                metadata: JSON.stringify({ virus_strain: stat.strain }),
            },
        });
        aiCount++;
    }
    console.log(`   ✓ Imported ${aiCount} AI records`);

    // 2. Import ASF Stats
    console.log('\n📊 Importing African Swine Fever Statistics...');
    let asfCount = 0;
    for (const stat of asfStats) {
        await prisma.diseaseStatistic.create({
            data: {
                state: stat.state,
                year: stat.year,
                diseaseType: 'African Swine Fever',
                deaths: stat.deaths,
                outbreaks: stat.outbreaks,
                affectedDistricts: stat.districts,
            },
        });
        asfCount++;
    }
    console.log(`   ✓ Imported ${asfCount} ASF records`);

    // 3. Import Risk Factors
    console.log('\n⚠️ Importing Risk Factors...');
    let riskCount = 0;
    for (const risk of riskFactors) {
        await prisma.riskFactor.create({
            data: {
                factor: risk.factor,
                asfRiskMultiplier: risk.asf,
                aiRiskMultiplier: risk.ai,
                evidence: true,
            },
        });
        riskCount++;
    }
    console.log(`   ✓ Imported ${riskCount} risk factors`);

    // 4. Import Biosecurity Indicators
    console.log('\n🛡️ Importing Biosecurity Indicators...');
    let indCount = 0;
    for (const ind of indicators) {
        await prisma.biosecurityIndicator.create({
            data: {
                indicatorId: ind.id,
                variableName: ind.name,
                importanceWeight: ind.weight,
                evidenceSource: ind.source,
                applicableTo: ind.type,
                poorPracticePrevalence: ind.prev,
            },
        });
        indCount++;
    }
    console.log(`   ✓ Imported ${indCount} indicators`);

    console.log('\n✅ Import completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
