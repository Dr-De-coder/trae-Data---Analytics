import { getDatabase } from '../database/database.js';

class QueryExecutorService {
  async executeQuery(sql) {
    const db = await getDatabase();
    const results = db.exec(sql);
    if (results.length === 0) {
      return [];
    }

    const columns = results[0].columns;
    const values = results[0].values;

    return values.map(row => {
      const obj = {};

      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });

      return obj;
    });
  }
}

export default new QueryExecutorService();
