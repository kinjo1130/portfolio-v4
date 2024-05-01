import { getPosts } from '@/libs/client'
import { NextApiRequest, NextApiResponse } from 'next'
import RSS from 'rss'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const feed = new RSS({
    title: "kinjo shotaroのブログ",
    description: "kinjo shotaroのブログ",
    site_url: "https://kinjo.me",
    feed_url: "フィードページのURL",
    language: 'ja',
  })
  const blogs = await getPosts()
  blogs?.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.createdAt),
      url: `${process.env.URL}/blog/${post.id}`,
    })
  })
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/xml')
  res.end(feed.xml())
}