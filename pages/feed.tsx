import { GetServerSidePropsContext } from "next";
import RSS from 'rss';
import { getPosts  } from "@/libs/client"
async function generateFeedXml() {
  const feed = new RSS({
    title: "kinjo shotaroのブログ",
    description: "kinjo shotaroのブログ",
    site_url: "https://kinjo.me",
    feed_url: "フィードページのURL",
    language: 'ja',
  });

  // 例としてpostsを含めるイメージ
  // このあたりの書き方はライブラリのドキュメントを参考にしてください
  const blogs = await getPosts();
  blogs?.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.createdAt),
      url: `${process.env.URL}/${post.id}`,
    });
  })
  
  // XML形式の文字列にする
  return feed.xml();
}
export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const xml = await generateFeedXml();

  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // 24時間キャッシュする
  res.setHeader('Content-Type', 'text/xml');
  res.end(xml);

  return {
    props: {},
  };
};

const Page = ()=>null;
export default Page;
