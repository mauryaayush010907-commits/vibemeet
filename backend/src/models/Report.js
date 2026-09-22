import { getDb } from '../config/db.js';

export const Report = {
  async create(row) {
    await (await getDb()).collection('reports').insertOne({ ...row, created_at: new Date().toISOString() });
  },
  async recent(limit = 100) {
    return (await getDb()).collection('reports').find({}, { projection: { _id: 0, id: 1, reason: 1, description: 1, created_at: 1 } }).sort({ created_at: -1 }).limit(limit).toArray();
  },
};
