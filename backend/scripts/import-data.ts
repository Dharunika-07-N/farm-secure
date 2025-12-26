import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importTrainingModules() {
    console.log('📚 Importing Training Modules...');

    const dataPath = path.join(__dirname, '../data/training-modules.json');
    const trainingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    let imported = 0;
    let skipped = 0;

    for (const module of trainingData) {
        try {
            await prisma.trainingModule.create({
                data: {
                    name: module.name,
                    description: module.description,
                    duration: module.duration,
                    level: module.level,
                    category: module.category,
                    objectives: JSON.stringify(module.objectives),
                    content: JSON.stringify(module.content),
                    isActive: true,
                },
            });
            imported++;
            console.log(`  ✓ Imported: ${module.name}`);
        } catch (error: any) {
            if (error.code === 'P2002') {
                skipped++;
                console.log(`  ⊘ Skipped (already exists): ${module.name}`);
            } else {
                console.error(`  ✗ Error importing ${module.name}:`, error.message);
            }
        }
    }

    console.log(`\n✅ Training Modules Import Complete:`);
    console.log(`   - Imported: ${imported}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${trainingData.length}\n`);
}

async function importDiseases() {
    console.log('🦠 Importing Disease Information...');

    const dataPath = path.join(__dirname, '../data/diseases.json');
    const diseaseData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    let imported = 0;
    let skipped = 0;

    for (const disease of diseaseData) {
        try {
            await prisma.disease.upsert({
                where: { name: disease.name },
                update: {
                    type: disease.type,
                    affectedSpecies: JSON.stringify(disease.affectedSpecies),
                    symptoms: JSON.stringify(disease.symptoms),
                    preventionMeasures: JSON.stringify(disease.preventionMeasures),
                    treatment: disease.treatment,
                    riskLevel: disease.riskLevel,
                    transmissionRoutes: JSON.stringify(disease.transmissionRoutes),
                    incubationPeriod: disease.incubationPeriod,
                    mortality: disease.mortality,
                },
                create: {
                    name: disease.name,
                    type: disease.type,
                    affectedSpecies: JSON.stringify(disease.affectedSpecies),
                    symptoms: JSON.stringify(disease.symptoms),
                    preventionMeasures: JSON.stringify(disease.preventionMeasures),
                    treatment: disease.treatment,
                    riskLevel: disease.riskLevel,
                    transmissionRoutes: JSON.stringify(disease.transmissionRoutes),
                    incubationPeriod: disease.incubationPeriod,
                    mortality: disease.mortality,
                },
            });
            imported++;
            console.log(`  ✓ Imported: ${disease.name}`);
        } catch (error: any) {
            skipped++;
            console.error(`  ✗ Error importing ${disease.name}:`, error.message);
        }
    }

    console.log(`\n✅ Disease Information Import Complete:`);
    console.log(`   - Imported: ${imported}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${diseaseData.length}\n`);
}

async function main() {
    console.log('🚀 Starting Data Import...\n');
    console.log('='.repeat(60));

    try {
        await importTrainingModules();
        await importDiseases();

        console.log('='.repeat(60));
        console.log('🎉 All data imported successfully!\n');
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
