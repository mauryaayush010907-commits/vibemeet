// Shared MongoDB connection. The connection is lazy so health checks can run
// before local credentials are configured.
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import logger from '../utils/logger.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || 'vibemeet';
let clientPromise;

export async function getDb() {
  if (!mongoUri) {
    throw new Error('MongoDB is not configured. Set MONGODB_URI in backend/.env.');
  }
  if (!clientPromise) {
    const client = new MongoClient(mongoUri);
    clientPromise = client.connect();
  }
  return (await clientPromise).db(mongoDbName);
}

if (!mongoUri) {
  logger.warn('MongoDB is not configured. Database-backed endpoints will be unavailable.');
}
