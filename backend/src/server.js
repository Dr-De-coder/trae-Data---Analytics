import 'dotenv/config';
import app from './app.js';
import { initializeDatabase } from './database/database.js';

const PORT = process.env.PORT || 5000;

// Initialize database first
await initializeDatabase();

// Only listen on port for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  console.log('Backend ready (Vercel production mode)');
}

// Export app for Vercel serverless
export default app;
