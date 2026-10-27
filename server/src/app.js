import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { guestOwnership } from './middleware/ownership.js';
import { mysteryRoutes } from './routes/mystery.routes.js';
import { investigationRoutes } from './routes/investigation.routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    formAction: ["'self'"],
    frameAncestors: ["'self'"],
    imgSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    styleSrcAttr: ["'unsafe-inline'"],
    upgradeInsecureRequests: config.nodeEnv === 'production' ? [] : null
  } } }));
  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '24kb' }));
  app.use(guestOwnership(config.sessionSecret, config.nodeEnv === 'production'));
  app.get('/api/v1/health', (req, res) => {
    const database = mongoose.connection.readyState === 1;
    res.status(database ? 200 : 503).json({ success: true, data: { application: 'available', database: database ? 'available' : 'unavailable' } });
  });
  app.use('/api/v1/mysteries', mysteryRoutes(config));
  app.use('/api/v1/investigations', investigationRoutes);
  app.use('/api/v1', notFound);
  if (config.nodeEnv === 'production') {
    const appDirectory = path.dirname(fileURLToPath(import.meta.url));
    const clientBuild = path.resolve(appDirectory, '../../client/dist');
    app.use(express.static(clientBuild, { index: false, maxAge: '1h' }));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(clientBuild, 'index.html'), (error) => error && next(error));
    });
  }
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
