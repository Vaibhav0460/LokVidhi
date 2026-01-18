import { Router, Request, Response } from 'express';
import pool from '../db';
import data from './BNS.json';
import data1 from './Acts.json';

const router = Router();

// THE GOLDEN DATA SET
const LIBRARY_DATA = [...data, ...data1];

// POST /api/seed/library
router.post('/library', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Clear existing Library data (Optional: Remove if you want to append)
    await client.query('TRUNCATE acts, sections RESTART IDENTITY CASCADE');

    // 2. Insert Acts & Sections
    for (const act of LIBRARY_DATA) {
      // Insert Act
      const actRes = await client.query(
        'INSERT INTO acts (title, category, jurisdiction) VALUES ($1, $2, $3) RETURNING id',
        [act.title, act.category, act.jurisdiction]
      );
      const actId = actRes.rows[0].id;

      // Insert Sections for this Act
      for (const section of act.sections) {
        await client.query(
          'INSERT INTO sections (act_id, section_number, legal_text, simplified_explanation) VALUES ($1, $2, $3, $4)',
          [actId, section.number, section.text, section.simple]
        );
      }
    }

    // 3. Fix Sequences (Crucial!)
    await client.query("SELECT setval('acts_id_seq', (SELECT MAX(id) FROM acts))");
    await client.query("SELECT setval('sections_id_seq', (SELECT MAX(id) FROM sections))");

    await client.query('COMMIT');
    res.json({ message: "Library populated successfully with " + LIBRARY_DATA.length + " Acts." });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Seeding Error:", err);
    res.status(500).json({ error: "Failed to seed library." });
  } finally {
    client.release();
  }
});

export default router;