import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; // Import the database connection
import scenarioRoutes from './routes/scenario';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/scenario', scenarioRoutes);

// 1. Simple API Test
app.get('/', (req, res) => {
  res.json({ message: 'LokVidhi API is running!' });
});


// 2. Database Connection Test
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database Connected Successfully!', 
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Connection Failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});