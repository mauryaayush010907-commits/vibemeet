import { getDb } from '../config/db.js';

export const Block = {
  async create({ blocker_session, blocked_session, match_id = null }) {
    await (await getDb()).collection('blocks').insertOne({ blocker_session, blocked_session, match_id, created_at: new Date().toISOString() });
  },
  async isBlocked(a, b) {
    return Boolean(await (await getDb()).collection('blocks').findOne({ $or: [
      { blocker_session: a, blocked_session: b },
      { blocker_session: b, blocked_session: a },
    ] }));
  },
};
