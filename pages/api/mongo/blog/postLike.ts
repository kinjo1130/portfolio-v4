import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../init';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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