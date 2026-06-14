const monitoredPersonId = 'monitored-misael';
const validIntensities = new Set(['Alta', 'Média', 'Baixa']);

function formatEvent(event) {
  const occurredAt = new Date(event.occurredAt);
  return {
    id: event.id,
    date: new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(occurredAt),
    time: new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    }).format(occurredAt),
    intensity: event.intensity,
    type: event.type,
    location: event.location,
    note: event.note,
  };
}

function periodFromDate(date) {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(date)),
  );
  return hour < 12 ? 'Manhã' : hour < 18 ? 'Tarde' : 'Noite';
}

function requiredText(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`O campo ${field} é obrigatório.`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

export function createMonitoringService(database) {
  return {
    async getProfile() {
      const profile = await database.monitoredPerson.findUniqueOrThrow({
        where: { id: monitoredPersonId },
      });
      return { userProfile: { name: profile.name, age: profile.age, room: profile.room } };
    },

    async getSummary() {
      const [snapshot, connectivity] = await Promise.all([
        database.monitoringSnapshot.findFirstOrThrow({
          where: { monitoredPersonId },
          orderBy: { createdAt: 'desc' },
        }),
        database.connectivitySnapshot.findFirstOrThrow({
          where: { monitoredPersonId, day: null },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        riskSummary: {
          score: snapshot.score,
          level: snapshot.level,
          reason: snapshot.reason,
          trend: snapshot.trend,
        },
        fallsSummary: {
          today: snapshot.today,
          sevenDays: snapshot.sevenDays,
          thirtyDays: snapshot.thirtyDays,
          trendDirection: snapshot.trendDirection,
          trendText: snapshot.trendText,
        },
        connectivity: {
          isConnected: connectivity.isConnected,
          disconnectedFor: connectivity.disconnectedFor,
          uptime: connectivity.uptime,
          lastSync: connectivity.lastSync,
        },
      };
    },

    async getEvents(filters = {}) {
      const where = { monitoredPersonId };
      for (const field of ['type', 'intensity', 'location']) {
        if (filters[field]) {
          where[field] = { equals: filters[field], mode: 'insensitive' };
        }
      }

      let events = await database.fallEvent.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
      });

      if (filters.period) {
        events = events.filter((event) => periodFromDate(event.occurredAt) === filters.period);
      }

      return { fallEvents: events.map(formatEvent) };
    },

    async createEvent(input) {
      const intensity = requiredText(input.intensity, 'intensity');
      if (!validIntensities.has(intensity)) {
        const error = new Error('A intensidade deve ser Alta, Média ou Baixa.');
        error.status = 400;
        throw error;
      }

      const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();
      if (Number.isNaN(occurredAt.getTime())) {
        const error = new Error('O campo occurredAt deve conter uma data válida.');
        error.status = 400;
        throw error;
      }

      const event = await database.fallEvent.create({
        data: {
          occurredAt,
          intensity,
          type: requiredText(input.type, 'type'),
          location: requiredText(input.location, 'location'),
          note: requiredText(input.note, 'note'),
          monitoredPersonId,
        },
      });
      return { fallEvent: formatEvent(event) };
    },

    async getAnalytics() {
      const [events, movementPatterns, connectivityRows] = await Promise.all([
        database.fallEvent.findMany({
          where: { monitoredPersonId },
          orderBy: { occurredAt: 'asc' },
        }),
        database.movementPattern.findMany({ where: { monitoredPersonId }, orderBy: { id: 'asc' } }),
        database.connectivitySnapshot.findMany({
          where: { monitoredPersonId, day: { not: null } },
          orderBy: { id: 'asc' },
        }),
      ]);

      const fallsOverTimeMap = new Map();
      const fallsByPeriodMap = new Map([
        ['Manhã', 0],
        ['Tarde', 0],
        ['Noite', 0],
      ]);

      for (const event of events) {
        const formatted = formatEvent(event);
        const shortDate = formatted.date.slice(0, 5);
        fallsOverTimeMap.set(shortDate, (fallsOverTimeMap.get(shortDate) || 0) + 1);
        const period = periodFromDate(event.occurredAt);
        fallsByPeriodMap.set(period, fallsByPeriodMap.get(period) + 1);
      }

      const fallsByPeriod = [...fallsByPeriodMap].map(([period, falls]) => ({ period, falls }));
      const highestPeriod = fallsByPeriod.reduce((highest, item) =>
        item.falls > highest.falls ? item : highest,
      );
      const latestMovement = movementPatterns.at(-1);
      const movementStatus =
        latestMovement?.mobility < 70
          ? 'Redução de mobilidade'
          : latestMovement?.abrupt > 40
            ? 'Movimentos bruscos'
            : 'Atividade normal';

      return {
        fallsOverTime: [...fallsOverTimeMap].map(([date, falls]) => ({ date, falls })),
        fallsByPeriod,
        highestPeriod,
        movementPatterns: movementPatterns.map(({ day, mobility, abrupt }) => ({
          day,
          mobility,
          abrupt,
        })),
        movementStatus,
        connectivityHistory: connectivityRows.map(({ day, onlineHours }) => ({
          day,
          online: onlineHours,
        })),
      };
    },
  };
}
