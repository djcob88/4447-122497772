// Adjusted client.ts as was running into an error after implementing the image_url column as the database was not being updated with the new column despite following previous steps to refresh the database
// ChatGPT help: https://chatgpt.com/share/69e95dfb-1794-83eb-8be8-924a9148a2b6
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

type SQLiteBootstrapDatabase = Pick<SQLiteDatabase, 'execSync' | 'getAllSync' | 'withTransactionSync'>;

function bootstrapDatabase(sqlite: SQLiteBootstrapDatabase) {
  sqlite.withTransactionSync(() => {
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        notes TEXT,
        image_url TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        colour TEXT NOT NULL,
        icon TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        notes TEXT,
        category_id INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time_period TEXT NOT NULL,
        target_minutes INTEGER NOT NULL,
        category_id INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    const columns = sqlite.getAllSync(`PRAGMA table_info(trips);`) as Array<{ name: string }>;
    const hasImageUrl = columns.some((column) => column.name === 'image_url');

    if (!hasImageUrl) {
      sqlite.execSync(`ALTER TABLE trips ADD COLUMN image_url TEXT;`);
    }
  });
}

const sqlite = openDatabaseSync('holiday-plannerV6.db');
bootstrapDatabase(sqlite);

export const db = drizzle(sqlite);
// End