// import { MongoClient } from 'mongodb';

// const uri = 'mongodb+srv://portfolio-cms:portfolio-cms@portfoliocms.ypdmhne.mongodb.net/?retryWrites=true&w=majority&appName=portfolioCMS';
// const dbName = 'sample_mflix'; // データベース名を指定
// export const client = new MongoClient(uri);

// export async function connectToDatabase() {
//   if (client.connect) await client.connect();
//   return client.db(dbName); // データベース名を指定
// }
import { MongoClient } from 'mongodb';

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME;

if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DATABASE) {
  throw new Error('Please define the MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, and MONGODB_DATABASE environment variables inside .env.local');
}

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.ypdmhne.mongodb.net/?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`;

export const client = new MongoClient(MONGODB_URI);

export async function connectToDatabase() {
  if (client.connect) await client.connect();
  return client.db(MONGODB_DATABASE); // データベース名を指定
}