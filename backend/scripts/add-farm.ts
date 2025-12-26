import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Find the user
    const user = await prisma.user.findFirst({
        where: { email: 'farmer@example.com' }
    });

    if (!user) {
        console.error('User farmer@example.com not found');
        return;
    }

    // 2. Create the new Farm
    const newFarm = await prisma.farm.create({
        data: {
            name: 'Green Valley Piggery',
            location: 'Maharashtra, India',
            size: 75.0,
            sizeUnit: 'acres',
            livestockType: 'Pig',
            animalCount: 1200,
            userId: user.id,
            infrastructure: 'Modern ventilation, automatic feeders',
            registrationNumber: 'MH-PIG-9982',
        }
    });

    console.log(`Created new farm: ${newFarm.name} with ID: ${newFarm.id}`);

    // 3. Create an alert for this farm
    await prisma.alert.create({
        data: {
            title: 'Swine Fever Precaution',
            description: 'New vaccination drive recommended for all swine herds in the Maharashtra region starting next week.',
            type: 'info',
            isRead: false,
            farmId: newFarm.id,
        }
    });

    console.log('Created alert for the new farm.');

    // 4. Create some compliance tasks
    await prisma.compliance.createMany({
        data: [
            { name: 'Slaughterhouse Log Audit', completed: false, date: new Date(), farmId: newFarm.id },
            { name: 'Feed Quality Inspection', completed: true, date: new Date(), farmId: newFarm.id },
        ]
    });

    console.log('Created compliance tasks for the new farm.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
