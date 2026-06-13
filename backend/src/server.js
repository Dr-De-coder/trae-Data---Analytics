import 'dotenv/config';
import app from './app.js';
import { initializeDatabase } from './database/database.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
  }
})();
