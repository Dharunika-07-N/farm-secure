import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const indicators = [
        // General
        { indicatorId: 1, variableName: 'visitor_registration', importanceWeight: 0.8, applicableTo: 'Both', category: 'Personnel', evidenceSource: 'FAO' },
        { indicatorId: 2, variableName: 'disinfection_points', importanceWeight: 0.9, applicableTo: 'Both', category: 'Infrastructure', evidenceSource: 'FAO' },

        // Poultry Specific
        { indicatorId: 3, variableName: 'bird_proofing', importanceWeight: 1.0, applicableTo: 'Poultry', category: 'Infrastructure', evidenceSource: 'FAO' },
        { indicatorId: 4, variableName: 'clean_water_source', importanceWeight: 0.7, applicableTo: 'Poultry', category: 'Resources', evidenceSource: 'FAO' },

        // Pig Specific
        { indicatorId: 5, variableName: 'pig_confinement', importanceWeight: 1.0, applicableTo: 'Pig', category: 'Infrastructure', evidenceSource: 'FAO' },
        { indicatorId: 6, variableName: 'waste_management', importanceWeight: 0.8, applicableTo: 'Pig', category: 'Resources', evidenceSource: 'FAO' },

        // Personnel
        { indicatorId: 7, variableName: 'staff_training', importanceWeight: 0.6, applicableTo: 'Both', category: 'Personnel', evidenceSource: 'FAO' },
        { indicatorId: 8, variableName: 'p_p_e_usage', importanceWeight: 0.9, applicableTo: 'Both', category: 'Personnel', evidenceSource: 'FAO' },
    ];

    console.log('Seeding indicators...');
    for (const indicator of indicators) {
        await prisma.biosecurityIndicator.upsert({
            where: { indicatorId: indicator.indicatorId },
            update: indicator,
            create: { ...indicator, poorPracticePrevalence: 0.5 },
        });
    }
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
