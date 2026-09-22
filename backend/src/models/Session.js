// Session model — anonymous per-tab session tracked in MongoDB.
import { getDb } from '../config/db.js';

export const Session = {
  async upsert(row) {
    await (await getDb()).collection('sessions').updateOne({ id: row.id }, { $set: row }, { upsert: true });
  },
  async delete(id) {
    await (await getDb()).collection('sessions').deleteOne({ id });
  },
  async listActive(cutoffIso) {
    return (await getDb()).collection('sessions').find(
      { last_seen: { $gte: cutoffIso } },
      { projection: { _id: 0, id: 1, status: 1, mode: 1, filters: 1, gender: 1, last_seen: 1 } },
    ).toArray();
  },
  async setStatus(id, status) {
    await (await getDb()).collection('sessions').updateOne({ id }, { $set: { status, last_seen: new Date().toISOString() } });
  },
  async cleanupStale(cutoffIso) {
    await (await getDb()).collection('sessions').deleteMany({ last_seen: { $lt: cutoffIso } });
  },
};
