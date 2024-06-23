import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog";
import { client } from "@/libs/client";
import Layout from "../layout";
import { formatDate, isDev } from "@/libs/common";
import { renderToc } from "@/libs/renderDoc";
import { SeoHead } from "@/components/SeoHead";

import { TableOfContents } from "@/components/TableOfContents";
import Button from "@/components/Button";
import Link from "next/link";
import useBlogLike from "@/hooks/useBlogLike";

interface BlogLike {
  likes: number;
  id: string;
  _id: string;
}

export default function BlogId({
  blog,
  likeData,
}: {
  blog: BlogPost;
  likeData: BlogLike;
}) {
  const toc = renderToc(blog.body);
  const isDevImageUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kinjo.me";
  // apiRouteからIDを取得していいね数を取得する
  const { postBlogLike, getBlogLike, setLikeCount, likeCount } = useBlogLike();
  const handleClickBlogPostLike = async () => {
    const res = await postBlogLike(blog.id);
    setLikeCount(res.likes);
  };
  useEffect(() => {
    getBlogLike(blog.id);
  }, []);
  return (
    <>
      <SeoHead
        title="Blog"
        titleTemplate={blog.title}
        description={blog.description}
        imgUrl={`${isDevImageUrl}/api/og?title=${encodeURIComponent(
          blog.title
        )}`}
      />
      <Layout title={blog.title} className=" md:px-20">
        <div className="mb-10">
          <p>公開日: {formatDate(blog.createdAt)}</p>
          <p>更新日: {formatDate(blog.updatedAt)}</p>
        </div>
        <div className="md:grid md:grid-cols-12">
          <TableOfContents toc={toc} className="col-span-2 mb-10 md:mb-0" />
          <div
            className="prose min-w-full col-span-10"
            dangerouslySetInnerHTML={{
              __html: `${blog.body}`,
            }}
          />
        </div>
        {/* いいねbuttonと数値表示 */}
        <div className="flex justify-center mt-20">
          <Button className="" handleClick={handleClickBlogPostLike}>
            いいね！
          </Button>
        </div>
        <p className="text-center">{likeCount}</p>

        <div className="flex justify-center mt-20">
          <Button>
            <Link href="/blog">ブログ一覧に戻る</Link>
          </Button>
        </div>
      </Layout>
    </>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blogs" });

  const paths = data.contents.map((content: BlogPost) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context: any) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blogs", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};
