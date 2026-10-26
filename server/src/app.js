import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { guestOwnership } from './middleware/ownership.js';
import { mysteryRoutes } from './routes/mystery.routes.js';
import { investigationRoutes } from './routes/investigation.routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '24kb' }));
  app.use(guestOwnership(config.sessionSecret, config.nodeEnv === 'production'));
  app.get('/api/v1/health', (req, res) => {
    const database = mongoose.connection.readyState === 1;
    res.status(database ? 200 : 503).json({ success: true, data: { application: 'available', database: database ? 'available' : 'unavailable' } });
  });
  app.use('/api/v1/mysteries', mysteryRoutes(config));
  app.use('/api/v1/investigations', investigationRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
