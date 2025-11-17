import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/scenario/:id
// Fetches the Scenario Title and the STARTING Node (First question)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const scenarioId = req.params.id;

    // 1. Get Scenario Details
    const scenarioRes = await pool.query('SELECT * FROM scenarios WHERE id = $1', [scenarioId]);
    if (scenarioRes.rows.length === 0) {
      res.status(404).json({ error: 'Scenario not found' });
      return;
    }

    // 2. Get the Start Node (We assume the one with the lowest ID is the start for now)
    const nodeRes = await pool.query(
      'SELECT * FROM scenario_nodes WHERE scenario_id = $1 ORDER BY id ASC LIMIT 1',
      [scenarioId]
    );

    if (nodeRes.rows.length === 0) {
      res.status(404).json({ error: 'No questions found for this scenario' });
      return;
    }

    const startNode = nodeRes.rows[0];

    // 3. Get Options for this Node
    const optionsRes = await pool.query(
      'SELECT id, option_text, next_node_id, related_section_id FROM node_options WHERE current_node_id = $1',
      [startNode.id]
    );

    // 4. Send the Package
    res.json({
      scenario: scenarioRes.rows[0],
      node: startNode,
      options: optionsRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /api/scenario/node/:nodeId
// Fetches a specific question (Node) and its options
router.get('/node/:nodeId', async (req: Request, res: Response): Promise<void> => {
    try {
      const nodeId = req.params.nodeId;
  
      // 1. Get the Node Content
      const nodeRes = await pool.query('SELECT * FROM scenario_nodes WHERE id = $1', [nodeId]);
      
      if (nodeRes.rows.length === 0) {
        res.status(404).json({ error: 'Step not found' });
        return;
      }
  
      const node = nodeRes.rows[0];
  
      // 2. Get Options for this Node
      const optionsRes = await pool.query(
        'SELECT id, option_text, next_node_id, related_section_id FROM node_options WHERE current_node_id = $1',
        [nodeId]
      );
  
      res.json({
        node: node,
        options: optionsRes.rows
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

export default router;