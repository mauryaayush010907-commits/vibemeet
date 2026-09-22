import { getDb } from './db-client.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { reporter_session, reported_session, match_id = null, reason, description = '' } = req.body || {};
    if (!reporter_session || !reported_session || !reason) {
      return res.status(400).json({ error: 'reporter_session, reported_session, and reason required' });
    }
    await (await getDb()).collection('reports').insertOne({
      reporter_session, reported_session, match_id, reason,
      description: (description || '').slice(0, 500),
      created_at: new Date().toISOString(),
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('report error', err);
    return res.status(500).json({ error: err.message });
  }
}
