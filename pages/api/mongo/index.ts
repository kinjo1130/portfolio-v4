import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('comments'); // コレクション名を指定
      const data = await collection.findOne({ name: 'Ned Stark' });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch data: ${error}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
