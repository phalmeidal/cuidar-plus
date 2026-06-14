import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  connectivity,
  connectivityHistory,
  fallEvents,
  fallsSummary,
  movementPatterns,
  riskSummary,
  userProfile,
} from './seedData.js';

const prisma = new PrismaClient();
const caregiverId = 'admin-001';

function parseBrazilianDate(date, time) {
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month}-${day}T${time}:00-03:00`);
}

async function seed() {
  await prisma.$transaction(async (database) => {
    await database.movementPattern.deleteMany();
    await database.connectivitySnapshot.deleteMany();
    await database.monitoringSnapshot.deleteMany();
    await database.fallEvent.deleteMany();
    await database.monitoredPerson.deleteMany();
    await database.user.deleteMany();

    await database.user.create({
      data: {
        id: caregiverId,
        name: 'Administrador Cuidar+',
        email: 'admin@cuidar.plus',
        role: 'admin',
      },
    });

    await database.monitoredPerson.create({
      data: {
        id: userProfile.id,
        name: userProfile.name,
        age: userProfile.age,
        room: userProfile.room,
        caregiverId,
      },
    });

    await database.monitoringSnapshot.create({
      data: {
        ...riskSummary,
        ...fallsSummary,
        monitoredPersonId: userProfile.id,
      },
    });

    await database.connectivitySnapshot.createMany({
      data: [
        { ...connectivity, monitoredPersonId: userProfile.id },
        ...connectivityHistory.map(({ day, online }) => ({
          ...connectivity,
          day,
          onlineHours: online,
          monitoredPersonId: userProfile.id,
        })),
      ],
    });

    await database.movementPattern.createMany({
      data: movementPatterns.map((pattern) => ({
        ...pattern,
        monitoredPersonId: userProfile.id,
      })),
    });

    await database.fallEvent.createMany({
      data: fallEvents.map(({ id: _id, date, time, ...event }) => ({
        ...event,
        occurredAt: parseBrazilianDate(date, time),
        monitoredPersonId: userProfile.id,
      })),
    });
  });
}

seed()
  .then(() => console.log('Cuidar+ seed completed.'))
  .finally(() => prisma.$disconnect());
