import express from 'express';
import { runAsync, getAsync, allAsync } from '../database.js';

const router = express.Router();

// Get user predictions
router.get('/user/:userId', async (req, res) => {
  try {
    const predictions = await allAsync(
      `SELECT p.*, m.team1, m.team2, m.result_team1, m.result_team2, m.date, m.status
       FROM predictions p
       JOIN matches m ON p.match_id = m.id
       WHERE p.user_id = ?
       ORDER BY m.date ASC`,
      [req.params.userId]
    );
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add prediction
router.post('/', async (req, res) => {
  try {
    const { user_id, match_id, predicted_team1, predicted_team2 } = req.body;

    if (!user_id || !match_id || predicted_team1 === undefined || predicted_team2 === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await runAsync(
      `INSERT INTO predictions (user_id, match_id, predicted_team1, predicted_team2)
       VALUES (?, ?, ?, ?)`,
      [user_id, match_id, predicted_team1, predicted_team2]
    );

    res.json({ id: result.id, message: 'Prediction added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update prediction
router.put('/:id', async (req, res) => {
  try {
    const { predicted_team1, predicted_team2 } = req.body;

    await runAsync(
      'UPDATE predictions SET predicted_team1 = ?, predicted_team2 = ? WHERE id = ?',
      [predicted_team1, predicted_team2, req.params.id]
    );

    res.json({ message: 'Prediction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
