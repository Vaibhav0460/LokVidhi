import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// --- 1. DASHBOARD STATS ---
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [userRes, scenarioRes, actRes] = await Promise.all([
      pool.query('SELECT COUNT(*) AS count FROM users'),
      pool.query('SELECT COUNT(*) AS count FROM scenarios'),
      pool.query('SELECT COUNT(*) AS count FROM acts')
    ]);

    res.json({
      users: parseInt(userRes.rows[0].count, 10) || 0,
      scenarios: parseInt(scenarioRes.rows[0].count, 10) || 0,
      acts: parseInt(actRes.rows[0].count, 10) || 0
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==========================================
//               SCENARIOS
// ==========================================

// GET /api/admin/scenarios (List)
router.get('/scenarios', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM scenarios ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// POST /api/admin/scenarios (Create)
router.post('/scenarios', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, difficulty } = req.body;
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

// PUT /api/admin/scenarios/:id (Update)
router.put('/scenarios/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty_level } = req.body;
    await pool.query(
      'UPDATE scenarios SET title = $1, description = $2, difficulty_level = $3 WHERE id = $4',
      [title, description, difficulty_level, id]
    );
    res.json({ message: "Scenario updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update scenario" });
  }
});

// DELETE /api/admin/scenarios/:id
router.delete('/scenarios/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM scenario_nodes WHERE scenario_id = $1', [id]);
    await pool.query('DELETE FROM scenarios WHERE id = $1', [id]);
    res.json({ message: "Scenario deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete scenario" });
  }
});

// ==========================================
//            SCENARIO NODES
// ==========================================

// GET /api/admin/scenarios/:id/nodes (Fetch All Nodes)
router.get('/scenarios/:id/nodes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM scenario_nodes WHERE scenario_id = $1 ORDER BY id ASC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nodes" });
  }
});

// POST /api/admin/nodes (Add Node)
router.post('/nodes', async (req: Request, res: Response) => {
  try {
    const { scenario_id, content_text, is_outcome } = req.body;
    const result = await pool.query(
      'INSERT INTO scenario_nodes (scenario_id, content_text, is_outcome) VALUES ($1, $2, $3) RETURNING *',
      [scenario_id, content_text, is_outcome || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add node" });
  }
});

// PUT /api/admin/nodes/:id (Update Node)
router.put('/nodes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content_text, is_outcome } = req.body;
    await pool.query(
      'UPDATE scenario_nodes SET content_text = $1, is_outcome = $2 WHERE id = $3',
      [content_text, is_outcome, id]
    );
    res.json({ message: "Node updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update node" });
  }
});

// DELETE /api/admin/nodes/:id
router.delete('/nodes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM scenario_nodes WHERE id = $1', [id]);
    res.json({ message: "Node deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete node" });
  }
});

// ==========================================
//                 ACTS
// ==========================================

// POST /api/admin/acts
router.post('/acts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, jurisdiction } = req.body;
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

// DELETE /api/admin/acts/:id
router.delete('/acts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sections WHERE act_id = $1', [id]); 
    await pool.query('DELETE FROM acts WHERE id = $1', [id]);
    res.json({ message: "Act deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete Act" });
  }
});

// PUT /api/admin/acts/:id
router.put('/acts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, jurisdiction } = req.body;
    await pool.query(
      'UPDATE acts SET title = $1, category = $2, jurisdiction = $3 WHERE id = $4',
      [title, category, jurisdiction, id]
    );
    res.json({ message: "Act updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Act" });
  }
});

// ==========================================
//               SECTIONS
// ==========================================

// GET /api/admin/acts/:id/sections
router.get('/acts/:id/sections', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sections WHERE act_id = $1 ORDER BY id ASC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

// POST /api/admin/sections
router.post('/sections', async (req: Request, res: Response) => {
  try {
    const { act_id, section_number, legal_text, simplified_explanation } = req.body;
    const result = await pool.query(
      'INSERT INTO sections (act_id, section_number, legal_text, simplified_explanation) VALUES ($1, $2, $3, $4) RETURNING *',
      [act_id, section_number, legal_text, simplified_explanation]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add section" });
  }
});

// DELETE /api/admin/sections/:id
router.delete('/sections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sections WHERE id = $1', [id]);
    res.json({ message: "Section deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete section" });
  }
});

// PUT /api/admin/sections/:id
router.put('/sections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { section_number, legal_text, simplified_explanation } = req.body;
    
    await pool.query(
      'UPDATE sections SET section_number = $1, legal_text = $2, simplified_explanation = $3 WHERE id = $4',
      [section_number, legal_text, simplified_explanation, id]
    );
    res.json({ message: "Section updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
});

export default router;