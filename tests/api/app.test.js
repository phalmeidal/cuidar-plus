import request from 'supertest';
import { createApp } from '../../api/src/app.js';

function createFakeDatabase() {
  const event = {
    id: 1,
    occurredAt: new Date('2026-05-05T10:42:00.000Z'),
    intensity: 'Alta',
    type: 'Queda confirmada',
    location: 'Quarto',
    note: 'Impacto forte detectado.',
  };

  return {
    monitoredPerson: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: 'monitored-misael',
        name: 'Misael',
        age: 72,
        room: 'Casa - Sala e quarto',
      }),
    },
    monitoringSnapshot: {
      findFirstOrThrow: vi.fn().mockResolvedValue({
        score: 78,
        level: 'Alto',
        reason: 'Atenção.',
        trend: 'Aumento',
        today: 1,
        sevenDays: 4,
        thirtyDays: 11,
        trendDirection: 'up',
        trendText: 'Aumento de 18%',
      }),
    },
    connectivitySnapshot: {
      findFirstOrThrow: vi.fn().mockResolvedValue({
        isConnected: true,
        disconnectedFor: '0 min',
        uptime: '98%',
        lastSync: 'há 2 min',
      }),
      findMany: vi.fn().mockResolvedValue([{ id: 1, day: 'Seg', onlineHours: 24 }]),
    },
    fallEvent: {
      findMany: vi.fn().mockResolvedValue([event]),
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 2, ...data })),
    },
    movementPattern: {
      findMany: vi.fn().mockResolvedValue([{ id: 1, day: 'Seg', mobility: 86, abrupt: 18 }]),
    },
  };
}

describe('Cuidar+ API', () => {
  it('returns health without checking the database', async () => {
    const readinessCheck = vi.fn();
    const app = createApp({ database: createFakeDatabase(), readinessCheck });

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'cuidar-plus-api' });
    expect(readinessCheck).not.toHaveBeenCalled();
  });

  it('reports ready only when the database is reachable', async () => {
    const readyApp = createApp({ database: createFakeDatabase(), readinessCheck: vi.fn() });
    const unavailableApp = createApp({
      database: createFakeDatabase(),
      readinessCheck: vi.fn().mockRejectedValue(new Error('offline')),
    });

    expect((await request(readyApp).get('/ready')).status).toBe(200);
    expect((await request(unavailableApp).get('/ready')).status).toBe(503);
  });

  it('lists events and forwards filters to the service database query', async () => {
    const database = createFakeDatabase();
    const app = createApp({ database, readinessCheck: vi.fn() });

    const response = await request(app).get('/api/events?intensity=Alta&location=Quarto');

    expect(response.status).toBe(200);
    expect(response.body.fallEvents[0]).toMatchObject({
      intensity: 'Alta',
      location: 'Quarto',
    });
    expect(database.fallEvent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          intensity: { equals: 'Alta', mode: 'insensitive' },
          location: { equals: 'Quarto', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('creates an event and rejects invalid intensity', async () => {
    const app = createApp({ database: createFakeDatabase(), readinessCheck: vi.fn() });
    const validEvent = {
      intensity: 'Alta',
      type: 'Queda confirmada',
      location: 'Sala',
      note: 'Evento criado na demonstração.',
      occurredAt: '2026-06-13T12:00:00.000Z',
    };

    expect((await request(app).post('/api/events').send(validEvent)).status).toBe(201);
    const invalid = await request(app)
      .post('/api/events')
      .send({ ...validEvent, intensity: 'Extrema' });

    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toMatch(/intensidade deve ser/i);
  });
});
