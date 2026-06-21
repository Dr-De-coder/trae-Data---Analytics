import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'nf_buildathon.db');
const csvDirectoryPath = path.join(__dirname, 'csv');

let db;
let initializationPromise;

function parseCsvLine(line) {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const currentChar = line[index];
    const nextChar = line[index + 1];

    if (currentChar === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (currentChar === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += currentChar;
    }
  }

  values.push(currentValue);
  return values;
}

function parseCsv(content) {
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();

  if (!normalizedContent) {
    return { headers: [], rows: [] };
  }

  const lines = normalizedContent.split('\n');
  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { headers, rows };
}

function inferColumnType(values) {
  const nonEmptyValues = values.filter((value) => value !== null);

  if (nonEmptyValues.length === 0) {
    return 'TEXT';
  }

  const isIntegerColumn = nonEmptyValues.every((value) => /^-?\d+$/.test(String(value)));
  if (isIntegerColumn) {
    return 'INTEGER';
  }

  const isRealColumn = nonEmptyValues.every((value) => /^-?\d+(\.\d+)?$/.test(String(value)));
  if (isRealColumn) {
    return 'REAL';
  }

  return 'TEXT';
}

function normalizeCellValue(value, columnType) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (columnType === 'INTEGER') {
    return Number.parseInt(value, 10);
  }

  if (columnType === 'REAL') {
    return Number.parseFloat(value);
  }

  return value;
}

function quoteIdentifier(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

function createTableFromCsv(database, tableName, headers, rows) {
  const columnTypes = headers.map((_, columnIndex) => {
    const columnValues = rows.map((row) => row[columnIndex] ?? '').map((value) => value.trim());
    const normalizedValues = columnValues.map((value) => (value === '' ? null : value));
    return inferColumnType(normalizedValues);
  });

  const createColumnsSql = headers
    .map((header, columnIndex) => `${quoteIdentifier(header)} ${columnTypes[columnIndex]}`)
    .join(', ');

  database.run(`DROP TABLE IF EXISTS ${quoteIdentifier(tableName)};`);
  database.run(`CREATE TABLE ${quoteIdentifier(tableName)} (${createColumnsSql});`);

  if (rows.length === 0) {
    return;
  }

  const placeholders = headers.map(() => '?').join(', ');
  const insertSql = `INSERT INTO ${quoteIdentifier(tableName)} (${headers
    .map(quoteIdentifier)
    .join(', ')}) VALUES (${placeholders});`;
  const statement = database.prepare(insertSql);

  try {
    database.run('BEGIN TRANSACTION;');

    rows.forEach((row) => {
      const values = headers.map((_, columnIndex) => {
        const rawValue = (row[columnIndex] ?? '').trim();
        return normalizeCellValue(rawValue, columnTypes[columnIndex]);
      });

      statement.run(values);
    });

    database.run('COMMIT;');
  } catch (error) {
    database.run('ROLLBACK;');
    throw error;
  } finally {
    statement.free();
  }
}

function importCsvDataset(database) {
  if (!fs.existsSync(csvDirectoryPath)) {
    return;
  }

  const csvFiles = fs
    .readdirSync(csvDirectoryPath)
    .filter((fileName) => fileName.toLowerCase().endsWith('.csv'))
    .sort();

  csvFiles.forEach((fileName) => {
    const tableName = path.parse(fileName).name;
    const filePath = path.join(csvDirectoryPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { headers, rows } = parseCsv(fileContent);

    if (headers.length > 0) {
      createTableFromCsv(database, tableName, headers, rows);
    }
  });
}

function persistDatabase(database) {
  const data = database.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function getTableCount(database) {
  const results = database.exec("SELECT COUNT(*) AS total FROM sqlite_master WHERE type = 'table';");
  return results[0]?.values?.[0]?.[0] ?? 0;
}

async function initializeDatabase({ forceRebuild = false } = {}) {
  if (db && !forceRebuild) {
    return db;
  }

  if (!initializationPromise || forceRebuild) {
    initializationPromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: file => path.join(__dirname, file)
      });
      const shouldPersistToDisk = !process.env.VERCEL;

      if (shouldPersistToDisk && forceRebuild && fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }

      if (shouldPersistToDisk && !forceRebuild && fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
      } else {
        db = new SQL.Database();
      }

      if (forceRebuild || getTableCount(db) === 0) {
        importCsvDataset(db);

        if (shouldPersistToDisk) {
          persistDatabase(db);
          console.log(`Database initialized from CSV files and saved to ${dbPath}`);
        } else {
          console.log('Database initialized from CSV files');
        }
      } else {
        console.log(`Connected to SQLite database at ${dbPath}`);
      }

      return db;
    })();
  }

  return initializationPromise;
}

async function getDatabase() {
  return initializeDatabase();
}

function getDatabasePath() {
  return dbPath;
}

export {
  initializeDatabase,
  getDatabase,
  getDatabasePath,
};
