import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

// ... other imports
import scenarioRoutes from './routes/scenario';
import calculatorRoutes from './routes/calculator';
import rentRoutes from './routes/rent';
import chatbotRoutes from './routes/chatbot';
// import libraryRoutes from './routes/library'; // <--- COMMENT THIS OUT
const libraryRoutes = require('./routes/library').default;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/scenario', scenarioRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/calculator/rent', rentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/library', libraryRoutes); // <--- COMMENT THIS OUT

// --- SANITY CHECK ROUTE (ADD THIS) ---
console.log(">>> REGISTERING SANITY CHECK ROUTE <<<");
app.get('/api/library/acts', (req, res) => {
  console.log("!!! HIT THE SANITY ROUTE !!!");
  res.json([{ id: 999, title: "Sanity Check Act", category: "Test" }]);
});
// -------------------------------------

app.get('/', (req, res) => {
  res.json({ message: 'LokVidhi API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});