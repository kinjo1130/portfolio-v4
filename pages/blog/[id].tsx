import Button from "@/components/Button";
import { SeoHead } from "@/components/SeoHead";
import { TableOfContents } from "@/components/TableOfContents";
import useBlogLike from "@/hooks/useBlogLike";
import { formatDate } from "@/libs/common";
import { getBlog, getBlogs } from "@/libs/content";
import { renderToc } from "@/libs/renderDoc";
import type { BlogPost } from "@/types/blog";
import Link from "next/link";
import { useEffect } from "react";
import Layout from "../layout";

interface BlogLike {
  likes: number;
  id: string;
  _id: string;
}

export default function BlogId({
  blog,
}: {
  blog: BlogPost;
  likeData: BlogLike;
}) {
  const toc = renderToc(blog.body);
  const isDevImageUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kinjo.me";
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

export const getStaticPaths = async () => {
  const paths = getBlogs().map((post) => `/blog/${post.id}`);
  return { paths, fallback: false };
};

export const getStaticProps = async (context: {
  params: { id: string };
}) => {
  const blog = getBlog(context.params.id);
  if (!blog) {
    return { notFound: true as const };
  }
  return {
    props: {
      blog,
    },
  };
};
