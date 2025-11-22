import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    console.log("--- DEBUG: Admin Stats Hit ---"); // Debug Log

    // Use 'AS count' to guarantee the column name
    const [userRes, scenarioRes, actRes] = await Promise.all([
      pool.query('SELECT COUNT(*) AS count FROM users'),
      pool.query('SELECT COUNT(*) AS count FROM scenarios'),
      pool.query('SELECT COUNT(*) AS count FROM acts')
    ]);

    // Log the raw result to debug
    // console.log("Users Raw:", userRes.rows[0]);

    const stats = {
      users: parseInt(userRes.rows[0].count, 10) || 0,
      scenarios: parseInt(scenarioRes.rows[0].count, 10) || 0,
      acts: parseInt(actRes.rows[0].count, 10) || 0
    };

    res.json(stats);

  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

router.post('/acts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, jurisdiction } = req.body;

    if (!title || !category) {
      res.status(400).json({ error: "Title and Category are required." });
      return;
    }

    const result = await pool.query(
      'INSERT INTO acts (title, category, jurisdiction) VALUES ($1, $2, $3) RETURNING *',
      [title, category, jurisdiction || 'National']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add Act Error:", err);
    res.status(500).json({ error: "Failed to add Act." });
  }
});

// --- 3. NEW: Create Scenario Shell ---
router.post('/scenarios', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, difficulty } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Title and Description are required." });
      return;
    }

    const result = await pool.query(
      'INSERT INTO scenarios (title, description, difficulty_level) VALUES ($1, $2, $3) RETURNING *',
      [title, description, difficulty || 'Beginner']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add Scenario Error:", err);
    res.status(500).json({ error: "Failed to create scenario." });
  }
});

export default router;