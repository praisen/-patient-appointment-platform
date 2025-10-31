import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try { await query('SELECT 1'); res.json({ status: 'ok' }); }
  catch (e) { res.status(500).json({ status: 'db_error', error: String(e) }); }
});

app.get('/api/appointments', async (_req, res) => {
  try { const result = await query('SELECT * FROM appointments ORDER BY scheduled_at DESC'); res.json(result.rows); }
  catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post('/api/appointments', async (req, res) => {
  const { patient_name, doctor_name, reason, scheduled_at } = req.body || {};
  if (!patient_name || !doctor_name || !scheduled_at) return res.status(400).json({ error: 'missing fields' });
  try {
    const result = await query(
      'INSERT INTO appointments (patient_name, doctor_name, reason, scheduled_at) VALUES ($1,$2,$3,$4) RETURNING *',
      [patient_name, doctor_name, reason || null, scheduled_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API listening on ${port}`));
