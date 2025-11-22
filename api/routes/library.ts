import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET All Acts
router.get('/acts', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM acts ORDER BY title ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch acts' });
  }
});

// GET Specific Act
router.get('/acts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const actResult = await pool.query('SELECT * FROM acts WHERE id = $1', [id]);
    if (actResult.rows.length === 0) {
      res.status(404).json({ error: 'Act not found' });
      return;
    }

    const sectionsResult = await pool.query(
      'SELECT * FROM sections WHERE act_id = $1 ORDER BY id ASC',
      [id]
    );

    res.json({
      act: actResult.rows[0],
      sections: sectionsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch act details' });
  }
});

export default router; // <--- 3. CORRECT EXPORT