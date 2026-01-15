import express from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products.js';
import { deployRouter } from './routes/deploy.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/deploy', deployRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_ERROR',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║           Content API Server Started              ║
╠═══════════════════════════════════════════════════╣
║  Port: ${PORT}                                       ║
║  Endpoints:                                       ║
║    GET    /api/health                             ║
║    GET    /api/products                           ║
║    GET    /api/products/:id                       ║
║    POST   /api/products                           ║
║    PUT    /api/products/:id                       ║
║    DELETE /api/products/:id                       ║
║    POST   /api/products/generate                  ║
║    POST   /api/deploy                             ║
╚═══════════════════════════════════════════════════╝
  `);
});
