import { getDb } from './db-client.js';

// Heartbeat window: sessions with last_seen older than this are considered gone.
const STALE_SECONDS = 45;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function cleanupStale() {
  const cutoff = new Date(Date.now() - STALE_SECONDS * 1000).toISOString();
  const db = await getDb();
  await db.collection('sessions').deleteMany({ last_seen: { $lt: cutoff } });
  // Also mark matches as ended if either participant is gone or match is very old
  const oldMatchCutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  await db.collection('matches').updateMany({ status: 'active', created_at: { $lt: oldMatchCutoff } }, { $set: { status: 'ended', ended_at: new Date().toISOString() } });
}

async function getCounts() {
  const cutoff = new Date(Date.now() - STALE_SECONDS * 1000).toISOString();
  const sessions = await (await getDb()).collection('sessions').find(
    { last_seen: { $gte: cutoff } },
    { projection: { _id: 0, id: 1, status: 1, mode: 1 } },
  ).toArray();

  const uniqueKey = (s) => s.id;
  const uniqueOnline = new Set();
  const uniqueSearching = new Set();
  const uniqueVideo = new Set();
  const uniqueText = new Set();

  for (const s of sessions || []) {
    const k = uniqueKey(s);
    uniqueOnline.add(k);
    if (s.status === 'searching') uniqueSearching.add(k);
    if (s.status === 'in_session' && s.mode === 'video') uniqueVideo.add(k);
    if (s.status === 'in_session' && s.mode === 'text') uniqueText.add(k);
  }

  return {
    onlineCount: uniqueOnline.size,
    searchingCount: uniqueSearching.size,
    videoChatCount: uniqueVideo.size,
    textChatCount: uniqueText.size,
    // per-mode searching (for the "people available now" indicator on the mode screen)
    searchingVideo: [...sessions || []].filter(s => s.status === 'searching' && s.mode === 'video').length,
    searchingText: [...sessions || []].filter(s => s.status === 'searching' && s.mode === 'text').length,
  };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      await cleanupStale();
      return res.status(200).json(await getCounts());
    }

    if (req.method === 'POST') {
      const { session_id, status = 'idle', mode = null, filters = null, gender = null } = req.body || {};
      if (!session_id) return res.status(400).json({ error: 'session_id required' });

      await cleanupStale();

      const row = {
        id: session_id,
        status,
        mode,
        filters: filters || {},
        gender,
        last_seen: new Date().toISOString(),
      };
      await (await getDb()).collection('sessions').updateOne({ id: session_id }, { $set: row }, { upsert: true });

      const counts = await getCounts();
      return res.status(200).json(counts);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('presence error', err);
    return res.status(500).json({ error: err.message });
  }
}
