import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../init';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('blog_likes');
      const { id } = req.query;
      let data = await collection.findOne({ id });
      console.log(data);
      if (!data) {
        // ドキュメントが存在しない場合、新しいドキュメントを作成
        await collection.insertOne({ id, likes: 0 });
        data = await collection.findOne({ id }); // ドキュメントを再取得して _id を含める
      }
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: `Failed to like post: ${error}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}