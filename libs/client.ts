import { BlogPost, BlogPosts } from '@/types/blog';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.SERVICE_DOMAIN as string,
  apiKey: process.env.API_KEY as string,
});

// getPosts 関数を追加
export async function getPosts(): Promise<BlogPosts> {
  try {
    const data = await client.get({ endpoint: "blogs" });
    return data.contents;
  } catch (error) {
    console.error(error);
    return [];
  }
}