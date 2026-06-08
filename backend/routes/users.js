import express from 'express';
import { allAsync, getAsync } from '../database.js';

const router = express.Router();

// Get all users with ranking
router.get('/ranking', async (req, res) => {
  try {
    const users = await allAsync(
      `SELECT id, username, email, points, created_at
       FROM users
       ORDER BY points DESC`
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getAsync(
      'SELECT id, username, email, points, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
