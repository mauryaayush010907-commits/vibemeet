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
    const { blocker_session, blocked_session, match_id = null } = req.body || {};
    if (!blocker_session || !blocked_session) {
      return res.status(400).json({ error: 'blocker_session and blocked_session required' });
    }
    const db = await getDb();
    await db.collection('blocks').insertOne({ blocker_session, blocked_session, match_id, created_at: new Date().toISOString() });

    // End the current match if provided
    if (match_id) {
      await db.collection('matches').updateOne({ id: match_id }, { $set: { status: 'ended', ended_at: new Date().toISOString() } });
      const m = await db.collection('matches').findOne({ id: match_id });
      if (m) {
        await db.collection('sessions').updateMany({ id: { $in: [m.session_a, m.session_b] } }, { $set: { status: 'idle', last_seen: new Date().toISOString() } });
      }
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('block error', err);
    return res.status(500).json({ error: err.message });
  }
}
