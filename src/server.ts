import express from 'express';
import { apiLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter';
import { validateRequest } from './middleware/validateRequest';

const app = express();

// Apply rate limiting middleware
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/upload/', uploadLimiter);

// Apply validation middleware
app.use(validateRequest);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;