import { client } from "@/libs/client";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import Layout from "../layout";
import { QiitaPost } from "@/types/Qiita";
import { getPublishedDate, isPostWithPath, isPostWithUrl } from "@/libs/common";
import { SeoHead } from "@/components/SeoHead";

// BlogPost型のオブジェクトであるかどうかをチェックする関数
function isBlogPost(post: BlogPost | QiitaPost | ZennPost): post is BlogPost {
  return (post as BlogPost).heroImage !== undefined;
}
// QiitaPostの型ガード関数
function isQiitaPost(post: BlogPost | QiitaPost | ZennPost): post is QiitaPost {
  if (isBlogPost(post)) return false;
  return (post as QiitaPost).user.id === "abcshotaro616";
}

// ZennPostの型ガード関数
function isZennPost(post: BlogPost | QiitaPost | ZennPost): post is ZennPost {
  if (isBlogPost(post)) return false;
  return (post as ZennPost).user.username === "kinjyo";
}

export default function Blog({
  blog,
}: {
  blog: (BlogPost | QiitaPost | ZennPost)[];
}) {
  return (
    <>
      <SeoHead
        title="Blog"
        titleTemplate="Top"
        description="Blogの一覧ページです"
        imgUrl="/favicon.ico"
      ></SeoHead>
      <Layout title="Blog" tooltipText="ブログページ一覧です">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blog.map((post) => (
            <Link
              key={post.id}
              className="rounded overflow-hidden shadow-lg hover:border-gray-400 border-2"
              href={
                isPostWithUrl(post)
                  ? post.url
                  : isPostWithPath(post)
                  ? `https://zenn.dev/${post.path}`
                  : `/blog/${post.id}`
              }
              passHref
              target={
                isPostWithUrl(post) || isPostWithPath(post) ? "_blank" : ""
              }
            >
              {/* microCMSから取得してきたサムネイルを表示 */}
              {isBlogPost(post) && post.heroImage && (
                <img
                  className="w-full"
                  src={post.heroImage.url}
                  alt="Blog image"
                />
              )}
              {/* Qiitaから取得してきたサムネイルを表示 */}
              {/* {isQiitaPost(post) && (
                <img className="w-full" src="/qiita.png" alt="Qiita image" />
              )} */}
              {/* Zennから取得してきたサムネイルを表示 */}
              {/* {isZennPost(post) && (
                <p className="text-8xl text-center align-middle my-9">
                  {post.emoji}
                </p>
              )} */}
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{post.title}</div>
                <p className="font-semibold text-gray-400">
                  {getPublishedDate(post).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  );
}
// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const blogs = await client.get({ endpoint: "blogs" });
  // apiRouteで作成したエンドポイントを指定してデータを取得します
  const apiBaseUrl = process.env.API_URL;
  // const qiita = await fetch(`${apiBaseUrl}/api/qiita`);
  // const zenn = await fetch(`${apiBaseUrl}/api/zenn`);
  // const data = await blogs.contents.concat(
  //   await qiita.json(),
  //   await zenn.json()
  // );
  // const sortedData = data.sort(
  //   (
  //     a: BlogPost | QiitaPost | ZennPost,
  //     b: BlogPost | QiitaPost | ZennPost
  //   ) => {
  //     return getPublishedDate(b).getTime() - getPublishedDate(a).getTime();
  //   }
  // );
  // console.log(data);
  return {
    props: {
      blog: blogs.contents,
    },
  };
};
