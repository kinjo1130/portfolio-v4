import { client } from "@/libs/client";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import Layout from "../layout";
export default function Blog({ blog }: { blog: BlogPost[] }) {
  return (
    <Layout title="Blog">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blog.map((blog) => (
          <div
            key={blog.id}
            className="max-w-sm rounded overflow-hidden shadow-lg"
          >
            <img className="w-full" src={blog.heroImage.url} alt="Blog image" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{blog.title}</div>
              <p className="text-gray-700 text-base">{blog.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <Link href={`/blog/${blog.id}`}>
                <p className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                  Read More
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const blogs = await client.get({ endpoint: "blogs" });
  // apiRouteで作成したエンドポイントを指定してデータを取得します
  // const apiBaseUrl = process.env.API_URL;
  // const qiita = await fetch(`${apiBaseUrl}/api/qiita`);
  // const data = blogs.contents.concat(await qiita.json());
  // console.log(data);
  return {
    props: {
      blog: blogs.contents,
    },
  };
};
