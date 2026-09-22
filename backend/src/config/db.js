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
    throw new Error('MONGODB_URI is missing');
  }

  if (!clientPromise) {
    console.log('MongoDB URI found:', !!mongoUri);
    console.log('MongoDB URI starts with:', mongoUri.substring(0, 14));
    console.log('MongoDB database:', mongoDbName);

    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    clientPromise = client.connect()
      .then(() => {
        console.log('✅ MongoDB CONNECTED');
        return client;
      })
      .catch((err) => {
        console.error('❌ MongoDB CONNECTION FAILED');
        console.error('Name:', err.name);
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Stack:', err.stack);

        // Important: allow another request to retry the connection
        clientPromise = null;

        throw err;
      });
  }

  const client = await clientPromise;
  return client.db(mongoDbName);
}

if (!mongoUri) {
  logger.warn('MongoDB is not configured.');
}