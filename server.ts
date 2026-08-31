import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import analyzerRoutes from './src/server/routes/analyzerRoutes';
import { errorHandlerMiddleware } from './src/server/middleware/errorHandler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Page Pulse API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Mount API Routes
  app.use('/api', analyzerRoutes);

  // Global Express Error Handling Middleware
  app.use(errorHandlerMiddleware);

  // Serve Frontend via Vite in Dev Mode or Static Files in Production Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Page Pulse Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting Page Pulse server:', err);
  process.exit(1);
});
