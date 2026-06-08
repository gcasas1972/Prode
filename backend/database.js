import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'prode.db');

let db;

export function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('✅ Connected to SQLite database');
      }
    });
  }
  return db;
}

export function initializeDatabase() {
  const database = getDatabase();

  database.serialize(() => {
    // Tabla de usuarios
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de partidos del mundial
    database.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        team1 TEXT NOT NULL,
        team2 TEXT NOT NULL,
        result_team1 INTEGER,
        result_team2 INTEGER,
        stage TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de pronósticos
    database.run(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        match_id INTEGER NOT NULL,
        predicted_team1 INTEGER,
        predicted_team2 INTEGER,
        predicted_outcome TEXT,
        points_earned INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (match_id) REFERENCES matches(id),
        UNIQUE(user_id, match_id)
      )
    `);

    // Ensure legacy DBs get the new column and nullable team prediction fields
    database.all("PRAGMA table_info(predictions)", (err, rows) => {
      if (err) {
        console.error('Error reading predictions table info:', err);
      } else {
        const hasOutcome = rows && rows.some(r => r.name === 'predicted_outcome');
        const team1NotNull = rows && rows.some(r => r.name === 'predicted_team1' && r.notnull === 1);
        const team2NotNull = rows && rows.some(r => r.name === 'predicted_team2' && r.notnull === 1);

        if (!hasOutcome) {
          database.run('ALTER TABLE predictions ADD COLUMN predicted_outcome TEXT', (alterErr) => {
            if (alterErr) console.error('Error adding predicted_outcome column:', alterErr);
            else console.log('✅ Added predicted_outcome column to predictions');
          });
        }

        if (team1NotNull || team2NotNull) {
          database.serialize(() => {
            database.run('PRAGMA foreign_keys = OFF');
            database.run('DROP TABLE IF EXISTS predictions_new');
            database.run(`
              CREATE TABLE predictions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                match_id INTEGER NOT NULL,
                predicted_team1 INTEGER,
                predicted_team2 INTEGER,
                predicted_outcome TEXT,
                points_earned INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (match_id) REFERENCES matches(id),
                UNIQUE(user_id, match_id)
              )
            `);
            database.run(`
              INSERT INTO predictions_new (id, user_id, match_id, predicted_team1, predicted_team2, predicted_outcome, points_earned, created_at)
              SELECT id, user_id, match_id, predicted_team1, predicted_team2, predicted_outcome, points_earned, created_at
              FROM predictions
            `);
            database.run('DROP TABLE predictions');
            database.run('ALTER TABLE predictions_new RENAME TO predictions');
            database.run('PRAGMA foreign_keys = ON');
            console.log('✅ Recreated predictions table with nullable predicted_team1/predicted_team2');
          });
        }
      }
    });

    console.log('✅ Database tables initialized');
  });
}

export function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
