import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../init';

const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',') : [];

const setCorsHeaders = (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(allowedOrigin => new RegExp(allowedOrigin.replace('*', '.*')).test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('blog_likes');
      const { id } = req.body;
      const data = await collection.findOne({ id });
      if (!data) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      const { likes } = data;
      const newLikes = likes + 1;
      await collection.updateOne({ id }, { $set: { likes: newLikes } });
      res.status(200).json({ likes: newLikes });
    } catch (error) {
      res.status(500).json({ error: `Failed to like post: ${error}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}