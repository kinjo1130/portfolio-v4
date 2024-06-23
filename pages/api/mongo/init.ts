import { Db, MongoClient } from 'mongodb';

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME;

if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DATABASE || !MONGODB_APP_NAME) {
  throw new Error('Please define the MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DATABASE, and MONGODB_APP_NAME environment variables inside .env.local');
}

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.ypdmhne.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);

  await client.connect();
  const db = client.db(MONGODB_DATABASE);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
