import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, runAsync } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, 'fixtures', 'worldcup2026_matches.json');

const matchDates = {
  1: '2026-06-11',
  2: '2026-06-11',
  3: '2026-06-12',
  4: '2026-06-12',
  5: '2026-06-13',
  6: '2026-06-13',
  7: '2026-06-13',
  8: '2026-06-13',
  9: '2026-06-14',
  10: '2026-06-14',
  11: '2026-06-14',
  12: '2026-06-14',
  13: '2026-06-15',
  14: '2026-06-15',
  15: '2026-06-15',
  16: '2026-06-15',
  17: '2026-06-16',
  18: '2026-06-16',
  19: '2026-06-16',
  20: '2026-06-16',
  21: '2026-06-17',
  22: '2026-06-17',
  23: '2026-06-17',
  24: '2026-06-17',
  25: '2026-06-18',
  26: '2026-06-18',
  27: '2026-06-18',
  28: '2026-06-18',
  29: '2026-06-19',
  30: '2026-06-19',
  31: '2026-06-19',
  32: '2026-06-19',
  33: '2026-06-20',
  34: '2026-06-20',
  35: '2026-06-20',
  36: '2026-06-20',
  37: '2026-06-21',
  38: '2026-06-21',
  39: '2026-06-21',
  40: '2026-06-21',
  41: '2026-06-22',
  42: '2026-06-22',
  43: '2026-06-22',
  44: '2026-06-22',
  45: '2026-06-23',
  46: '2026-06-23',
  47: '2026-06-23',
  48: '2026-06-23',
  49: '2026-06-24',
  50: '2026-06-24',
  51: '2026-06-24',
  52: '2026-06-24',
  53: '2026-06-24',
  54: '2026-06-24',
  55: '2026-06-25',
  56: '2026-06-25',
  57: '2026-06-25',
  58: '2026-06-25',
  59: '2026-06-25',
  60: '2026-06-25',
  61: '2026-06-26',
  62: '2026-06-26',
  63: '2026-06-26',
  64: '2026-06-26',
  65: '2026-06-26',
  66: '2026-06-26',
  67: '2026-06-27',
  68: '2026-06-27',
  69: '2026-06-27',
  70: '2026-06-27',
  71: '2026-06-27',
  72: '2026-06-27',
  73: '2026-06-28',
  74: '2026-06-29',
  75: '2026-06-29',
  76: '2026-06-29',
  77: '2026-06-30',
  78: '2026-06-30',
  79: '2026-06-30',
  80: '2026-07-01',
  81: '2026-07-01',
  82: '2026-07-01',
  83: '2026-07-02',
  84: '2026-07-02',
  85: '2026-07-02',
  86: '2026-07-03',
  87: '2026-07-03',
  88: '2026-07-03',
  89: '2026-07-04',
  90: '2026-07-04',
  91: '2026-07-05',
  92: '2026-07-05',
  93: '2026-07-06',
  94: '2026-07-06',
  95: '2026-07-07',
  96: '2026-07-07',
  97: '2026-07-09',
  98: '2026-07-10',
  99: '2026-07-11',
  100: '2026-07-11',
  101: '2026-07-14',
  102: '2026-07-15',
  103: '2026-07-18',
  104: '2026-07-19',
};

async function updateDates() {
  const raw = fs.readFileSync(fixturesPath, 'utf-8');
  const fixtures = JSON.parse(raw);

  await initializeDatabase();

  let updatedCount = 0;
  for (const match of fixtures) {
    const { match_number, team1, team2, stage } = match;
    const date = matchDates[match_number];

    if (!date) {
      console.warn(`Skipping match ${match_number}: no date mapping available`);
      continue;
    }

    const result = await runAsync(
      'UPDATE matches SET date = ? WHERE team1 = ? AND team2 = ? AND stage = ?',
      [date, team1, team2, stage]
    );

    if (result.changes === 0) {
      const reversed = await runAsync(
        'UPDATE matches SET date = ? WHERE team1 = ? AND team2 = ? AND stage = ?',
        [date, team2, team1, stage]
      );
      if (reversed.changes > 0) {
        updatedCount += reversed.changes;
        continue;
      }
      console.warn(`No match row found for ${team1} vs ${team2} (${stage})`);
    } else {
      updatedCount += result.changes;
    }
  }

  console.log(`✅ Updated dates for ${updatedCount} matches.`);
}

updateDates().catch((error) => {
  console.error('Error al actualizar fechas de partidos:', error.message);
  process.exit(1);
});
