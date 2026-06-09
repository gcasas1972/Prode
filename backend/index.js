import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import matchesRoutes from './routes/matches.js';
import predictionsRoutes from './routes/predictions.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/matches', matchesRoutes);
    app.use('/api/predictions', predictionsRoutes);
    app.use('/api/users', usersRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'Server is running' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
