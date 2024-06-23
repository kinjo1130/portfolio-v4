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