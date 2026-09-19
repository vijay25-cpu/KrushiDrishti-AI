/**
 * KRUSHIDRISHTI AI — Server Entry Point
 * Developed by Sopan Pandit Gavali
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 25MB limit for high-resolution leaf images
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'KRUSHIDRISHTI AI',
      tagline: 'Smart Vision for Healthier Crops',
      developer: 'Developed by Sopan Pandit Gavali',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KRUSHIDRISHTI AI server running at http://0.0.0.0:${PORT}`);
    console.log(`“Smart Vision for Healthier Crops” — Developed by Sopan Pandit Gavali`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
