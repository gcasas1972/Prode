import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAsync, allAsync, initializeDatabase } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, 'fixtures', 'worldcup2026_matches.json');

async function seed() {
  const data = JSON.parse(fs.readFileSync(fixturesPath, 'utf-8'));

  try {
    await initializeDatabase();

    console.log('🚀 Seeding World Cup 2026 matches into MySQL...');

    await runAsync('DELETE FROM matches');

    for (const match of data) {
      const { date, team1, team2, stage } = match;
      await runAsync(
        'INSERT INTO matches (date, team1, team2, stage, status) VALUES (?, ?, ?, ?, ?)',
        [date || null, team1, team2, stage || 'Group', 'pending']
      );
    }

    const inserted = await allAsync('SELECT COUNT(*) as cnt FROM matches');
    console.log('✅ Seed complete. Matches inserted:', inserted[0]?.cnt ?? inserted.cnt);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seed();
