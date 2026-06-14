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
  await prisma.movementPattern.deleteMany();
  await prisma.connectivitySnapshot.deleteMany();
  await prisma.monitoringSnapshot.deleteMany();
  await prisma.fallEvent.deleteMany();
  await prisma.monitoredPerson.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: caregiverId,
      name: 'Administrador Cuidar+',
      email: 'admin@cuidar.plus',
      role: 'admin',
    },
  });

  await prisma.monitoredPerson.create({
    data: {
      id: userProfile.id,
      name: userProfile.name,
      age: userProfile.age,
      room: userProfile.room,
      caregiverId,
    },
  });

  await prisma.monitoringSnapshot.create({
    data: {
      ...riskSummary,
      ...fallsSummary,
      monitoredPersonId: userProfile.id,
    },
  });

  await prisma.connectivitySnapshot.createMany({
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

  await prisma.movementPattern.createMany({
    data: movementPatterns.map((pattern) => ({
      ...pattern,
      monitoredPersonId: userProfile.id,
    })),
  });

  await prisma.fallEvent.createMany({
    data: fallEvents.map(({ id: _id, date, time, ...event }) => ({
      ...event,
      occurredAt: parseBrazilianDate(date, time),
      monitoredPersonId: userProfile.id,
    })),
  });
}

seed()
  .then(() => console.log('Cuidar+ seed completed.'))
  .finally(() => prisma.$disconnect());
