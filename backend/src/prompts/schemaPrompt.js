import { getDatabase } from '../database/database.js';

async function getSchemaPrompt() {
  const db = await getDatabase();
  const results = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  const tableNames =
    results[0]?.values?.map((row) => row[0]).filter(Boolean) || [];

  if (tableNames.length === 0) {
    return 'Database schema is currently empty.';
  }

  const tableSchemas = tableNames.map((tableName) => {
    const tableInfo = db.exec(`PRAGMA table_info("${tableName}");`);
    const columns = tableInfo[0]?.values?.map((row) => row[1]).join(', ') || '';
    return `${tableName}(${columns})`;
  });

  return `Available tables and columns: ${tableSchemas.join('; ')}`;
}

export { getSchemaPrompt };
