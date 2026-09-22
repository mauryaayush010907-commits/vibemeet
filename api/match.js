import crypto from 'node:crypto';
import { getDb } from './db-client.js';

const STALE_SECONDS = 45;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function compatible(a, b) {
  if (a.id === b.id || a.mode !== b.mode) return false;
  const af = a.filters || {}, bf = b.filters || {};
  if (af.preferred_gender && af.preferred_gender !== 'Anyone' && b.gender && b.gender !== af.preferred_gender) return false;
  if (bf.preferred_gender && bf.preferred_gender !== 'Anyone' && a.gender && a.gender !== bf.preferred_gender) return false;
  if (af.country && af.country !== 'Any' && bf.country && bf.country !== 'Any' && af.country !== bf.country) return false;
  if (af.language && af.language !== 'Any' && bf.language && bf.language !== 'Any' && af.language !== bf.language) return false;
  return true;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const db = await getDb();
    const sessions = db.collection('sessions');
    const matches = db.collection('matches');
    const { action } = req.body || {};
    const { session_id, mode, filters = {}, gender = null } = req.body || {};

    if (action === 'find') {
      if (!session_id || !mode) return res.status(400).json({ error: 'session_id and mode required' });
      const cutoff = new Date(Date.now() - STALE_SECONDS * 1000).toISOString();
      await sessions.deleteMany({ last_seen: { $lt: cutoff } });
      const self = { id: session_id, mode, filters, gender, status: 'searching', last_seen: new Date().toISOString() };
      await sessions.updateOne({ id: session_id }, { $set: self }, { upsert: true });
      const existing = await matches.findOne({ status: 'active', $or: [{ session_a: session_id }, { session_b: session_id }] }, { sort: { created_at: -1 } });
      if (existing) return res.json({ matched: true, match_id: existing.id, role: existing.session_a === session_id ? 'initiator' : 'responder', peer_session_id: existing.session_a === session_id ? existing.session_b : existing.session_a });
      const candidates = await sessions.find({ status: 'searching', mode, last_seen: { $gte: cutoff }, id: { $ne: session_id } }).sort({ last_seen: 1 }).toArray();
      let candidate = null;
      for (const item of candidates) {
        if (!compatible(self, item)) continue;
        const blocked = await db.collection('blocks').findOne({ $or: [{ blocker_session: session_id, blocked_session: item.id }, { blocker_session: item.id, blocked_session: session_id }] });
        if (!blocked) { candidate = item; break; }
      }
      if (!candidate) return res.json({ matched: false });
      const [a, b] = [session_id, candidate.id].sort();
      const match = { id: crypto.randomUUID(), session_a: a, session_b: b, mode, status: 'active', created_at: new Date().toISOString() };
      await matches.insertOne(match);
      await sessions.updateMany({ id: { $in: [a, b] } }, { $set: { status: 'in_session', last_seen: new Date().toISOString() } });
      return res.json({ matched: true, match_id: match.id, role: a === session_id ? 'initiator' : 'responder', peer_session_id: session_id === a ? b : a });
    }
    if (action === 'cancel') {
      if (!session_id) return res.status(400).json({ error: 'session_id required' });
      await sessions.updateOne({ id: session_id }, { $set: { status: 'idle', last_seen: new Date().toISOString() } });
      return res.json({ ok: true });
    }
    if (action === 'end') {
      if (!session_id) return res.status(400).json({ error: 'session_id required' });
      if (req.body.match_id) {
        const match = await matches.findOne({ id: req.body.match_id });
        await matches.updateOne({ id: req.body.match_id }, { $set: { status: 'ended', ended_at: new Date().toISOString() } });
        if (match) await sessions.updateMany({ id: { $in: [match.session_a, match.session_b] } }, { $set: { status: 'idle', last_seen: new Date().toISOString() } });
      } else await sessions.updateOne({ id: session_id }, { $set: { status: 'idle', last_seen: new Date().toISOString() } });
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('match error', err);
    return res.status(500).json({ error: err.message });
  }
}
