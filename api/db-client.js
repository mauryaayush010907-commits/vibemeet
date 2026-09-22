import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'vibemeet';
let clientPromise;

export async function getDb() {
  if (!uri) throw new Error('MongoDB is not configured. Set MONGODB_URI.');
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return (await clientPromise).db(dbName);
}
