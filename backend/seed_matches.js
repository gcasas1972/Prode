import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAsync, allAsync, initializeDatabase } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, 'fixtures', 'worldcup2026_matches.json');

async function seed() {
  const data = JSON.parse(fs.readFileSync(fixturesPath, 'utf-8'));

  try {
    // Ensure tables are initialized
    initializeDatabase();

    console.log('Seeding matches...');

    // Optional: clear existing matches
    await runAsync('DELETE FROM matches');

    for (const m of data) {
      const { date, team1, team2, stage } = m;
      await runAsync(
        'INSERT INTO matches (date, team1, team2, stage, status) VALUES (?, ?, ?, ?, ?)',
        [date || null, team1, team2, stage || 'Group', 'pending']
      );
    }

    const inserted = await allAsync('SELECT COUNT(*) as cnt FROM matches');
    console.log('Seed complete. Matches inserted:', inserted[0]?.cnt ?? inserted.cnt);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
