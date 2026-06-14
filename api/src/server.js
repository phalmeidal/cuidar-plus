import { createApp } from './app.js';
import { config } from './config.js';
import { prisma } from './db/prisma.js';

const app = createApp({
  database: prisma,
  readinessCheck: () => prisma.$queryRaw`SELECT 1`,
});

const server = app.listen(config.port, () => {
  console.log(`Cuidar+ API listening on http://localhost:${config.port}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
