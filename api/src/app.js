import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createMonitoringService } from './services/monitoringService.js';

export function createApp({ database, readinessCheck }) {
  const app = express();
  const monitoringService = createMonitoringService(database);

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      service: 'cuidar-plus-api',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/ready', async (_request, response) => {
    try {
      await readinessCheck();
      response.json({ status: 'ready', database: 'reachable' });
    } catch {
      response.status(503).json({ status: 'not-ready', database: 'unreachable' });
    }
  });

  app.get('/api/profile', async (_request, response, next) => {
    try {
      response.json(await monitoringService.getProfile());
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/summary', async (_request, response, next) => {
    try {
      response.json(await monitoringService.getSummary());
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/events', async (request, response, next) => {
    try {
      response.json(await monitoringService.getEvents(request.query));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/events', async (request, response, next) => {
    try {
      response.status(201).json(await monitoringService.createEvent(request.body));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/analytics', async (_request, response, next) => {
    try {
      response.json(await monitoringService.getAnalytics());
    } catch (error) {
      next(error);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
