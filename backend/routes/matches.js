import express from 'express';
import { allAsync, getAsync, runAsync } from '../database.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await allAsync('SELECT * FROM matches ORDER BY date ASC');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await getAsync('SELECT * FROM matches WHERE id = ?', [req.params.id]);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add match (admin only)
router.post('/', async (req, res) => {
  try {
    const { date, team1, team2, stage } = req.body;

    if (!date || !team1 || !team2) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await runAsync(
      'INSERT INTO matches (date, team1, team2, stage, status) VALUES (?, ?, ?, ?, ?)',
      [date, team1, team2, stage || 'Group', 'pending']
    );

    res.json({ id: result.id, message: 'Match added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update match result
router.put('/:id', async (req, res) => {
  try {
    const { result_team1, result_team2, status } = req.body;

    await runAsync(
      'UPDATE matches SET result_team1 = ?, result_team2 = ?, status = ? WHERE id = ?',
      [result_team1, result_team2, status || 'completed', req.params.id]
    );

    res.json({ message: 'Match updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
