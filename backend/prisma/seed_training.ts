import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const modules = [
        {
            name: 'Personnel Biosecurity Basics',
            description: 'Essential hygiene and protocol training for all farm staff.',
            duration: 45,
            level: 'Beginner',
            category: 'Personnel',
            objectives: JSON.stringify(['Understand pathogen transmission', 'Master handwashing techniques', 'Use PPE correctly']),
            content: JSON.stringify({ sections: [{ title: 'Intro', body: '...' }] }),
        },
        {
            name: 'Infrastructure & Perimeter Control',
            description: 'How to maintain physical barriers and disinfection points.',
            duration: 60,
            level: 'Intermediate',
            category: 'Infrastructure',
            objectives: JSON.stringify(['Maintain fencing', 'Optimize disinfection pits', 'Control access points']),
            content: JSON.stringify({ sections: [{ title: 'Points', body: '...' }] }),
        },
        {
            name: 'Advanced Resource Management',
            description: 'Managing water and feed safety to prevent contamination.',
            duration: 30,
            level: 'Advanced',
            category: 'Resources',
            objectives: JSON.stringify(['Water quality testing', 'Safe feed storage', 'Waste disposal']),
            content: JSON.stringify({ sections: [{ title: 'Feed', body: '...' }] }),
        },
    ];

    console.log('Seeding training modules...');
    for (const m of modules) {
        await prisma.trainingModule.create({ data: m });
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
