CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MonitoredPerson" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "room" TEXT NOT NULL,
  "caregiverId" TEXT,
  CONSTRAINT "MonitoredPerson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FallEvent" (
  "id" SERIAL NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "intensity" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "note" TEXT NOT NULL,
  "monitoredPersonId" TEXT NOT NULL,
  CONSTRAINT "FallEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MonitoringSnapshot" (
  "id" SERIAL NOT NULL,
  "score" INTEGER NOT NULL,
  "level" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "trend" TEXT NOT NULL,
  "today" INTEGER NOT NULL,
  "sevenDays" INTEGER NOT NULL,
  "thirtyDays" INTEGER NOT NULL,
  "trendDirection" TEXT NOT NULL,
  "trendText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "monitoredPersonId" TEXT NOT NULL,
  CONSTRAINT "MonitoringSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectivitySnapshot" (
  "id" SERIAL NOT NULL,
  "isConnected" BOOLEAN NOT NULL,
  "disconnectedFor" TEXT NOT NULL,
  "uptime" TEXT NOT NULL,
  "lastSync" TEXT NOT NULL,
  "day" TEXT,
  "onlineHours" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "monitoredPersonId" TEXT NOT NULL,
  CONSTRAINT "ConnectivitySnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MovementPattern" (
  "id" SERIAL NOT NULL,
  "day" TEXT NOT NULL,
  "mobility" INTEGER NOT NULL,
  "abrupt" INTEGER NOT NULL,
  "monitoredPersonId" TEXT NOT NULL,
  CONSTRAINT "MovementPattern_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "FallEvent_monitoredPersonId_occurredAt_idx" ON "FallEvent"("monitoredPersonId", "occurredAt");
CREATE INDEX "MonitoringSnapshot_monitoredPersonId_createdAt_idx" ON "MonitoringSnapshot"("monitoredPersonId", "createdAt");
CREATE INDEX "ConnectivitySnapshot_monitoredPersonId_createdAt_idx" ON "ConnectivitySnapshot"("monitoredPersonId", "createdAt");
CREATE INDEX "MovementPattern_monitoredPersonId_idx" ON "MovementPattern"("monitoredPersonId");

ALTER TABLE "MonitoredPerson" ADD CONSTRAINT "MonitoredPerson_caregiverId_fkey"
FOREIGN KEY ("caregiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FallEvent" ADD CONSTRAINT "FallEvent_monitoredPersonId_fkey"
FOREIGN KEY ("monitoredPersonId") REFERENCES "MonitoredPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MonitoringSnapshot" ADD CONSTRAINT "MonitoringSnapshot_monitoredPersonId_fkey"
FOREIGN KEY ("monitoredPersonId") REFERENCES "MonitoredPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConnectivitySnapshot" ADD CONSTRAINT "ConnectivitySnapshot_monitoredPersonId_fkey"
FOREIGN KEY ("monitoredPersonId") REFERENCES "MonitoredPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MovementPattern" ADD CONSTRAINT "MovementPattern_monitoredPersonId_fkey"
FOREIGN KEY ("monitoredPersonId") REFERENCES "MonitoredPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
