import Database from 'better-sqlite3';
import { IStoreSettingsObject } from './interfaces';
import { settings } from './constants';

const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS tabs (
    id TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS currentTab (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

const initializeSettings = () => {
  const insert = db.prepare(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
  );
  const insertMany = db.transaction(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (settings: Record<string, IStoreSettingsObject>) => {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in settings) {
        insert.run(key, JSON.stringify(settings[key]));
      }
    },
  );

  insertMany(settings as any);
};

initializeSettings();

export const getSettings = () => {
  const rows = db.prepare('SELECT * FROM settings').all();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const settings: Record<string, IStoreSettingsObject> = {};
  rows.forEach((row) => {
    settings[(row as any).key] = JSON.parse((row as any).value);
  });
  return settings;
};

export const getSettingsValue = (key: string): IStoreSettingsObject | null => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? JSON.parse((row as any).value) : null;
};

export const setSettingsValue = (key: string, value: IStoreSettingsObject) => {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
    key,
    JSON.stringify(value),
  );
};

export const deleteSettingsValue = (key: string) => {
  db.prepare('DELETE FROM settings WHERE key = ?').run(key);
};
