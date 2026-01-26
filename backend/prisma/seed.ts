import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create a User (Farmer)
    const user = await prisma.user.upsert({
        where: { email: 'farmer@example.com' },
        update: {},
        create: {
            email: 'farmer@example.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'FARMER',
        },
    });

    console.log(`Created user with id: ${user.id}`);

    // 2. Create a Farm
    const farm = await prisma.farm.create({
        data: {
            name: "Sunny Side Poultry",
            location: "Karnataka, India",
            size: 50.5,
            description: "A large poultry farm focusing on broiler chickens.",
            userId: user.id,
        },
    });

    console.log(`Created farm with id: ${farm.id}`);

    // 3. Create Crops/Livestock
    // Ideally, you'd want a "Livestock" model too, but using generic inventory/crops for now
    await prisma.crop.create({
        data: {
            name: "Maize for Feed",
            variety: "Hybrid-X",
            plantingDate: new Date('2024-05-15'),
            area: 10,
            farmId: farm.id,
            status: 'GROWING'
        }
    });

    // 4. Create Alerts (Notifications)
    await prisma.alert.createMany({
        data: [
            {
                title: "Temperature Spike",
                description: "Coop 3 temperature exceeded 30°C",
                type: "warning",
                farmId: farm.id,
                isRead: false
            },
            {
                title: "Feed Stock Low",
                description: "Broiler starter feed is below 100kg",
                type: "info",
                farmId: farm.id,
                isRead: false
            }
        ]
    });

    // 5. Create Compliance Tasks
    await prisma.compliance.createMany({
        data: [
            { name: "Daily Water Quality Check", status: 'COMPLETED', farmId: farm.id },
            { name: "Weekly Disinfection", status: 'NOT_STARTED', farmId: farm.id },
            { name: "Vaccination Schedule Review", status: 'IN_PROGRESS', farmId: farm.id },
            { name: "Visitor Log Update", status: 'COMPLETED', farmId: farm.id },
            { name: "Rodent Control Inspection", status: 'COMPLETED', farmId: farm.id }
        ]
    });

    // 6. Create Outbreaks (Public Data)
    // These will show up on the map
    await prisma.outbreak.createMany({
        data: [
            {
                name: "H5N1 Outbreak - District A",
                type: "avian_influenza",
                latitude: 12.9716, // Bangalore
                longitude: 77.5946,
                severity: "high",
                date: new Date('2024-01-28'),
                affectedAnimals: 5000,
                riskRadius: 50
            },
            {
                name: "Newcastle Disease - Area C",
                type: "newcastle_disease",
                latitude: 19.0760, // Mumbai
                longitude: 72.8777,
                severity: "medium",
                date: new Date('2024-01-20'),
                affectedAnimals: 2000,
                riskRadius: 25
            },
            {
                name: "ASF Alert - Region B",
                type: "african_swine_fever",
                latitude: 28.6139, // Delhi
                longitude: 77.2090,
                severity: "high",
                date: new Date('2024-01-25'),
                affectedAnimals: 800,
                riskRadius: 40
            }
        ]
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
