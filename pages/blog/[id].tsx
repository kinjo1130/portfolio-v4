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

export default function BlogId({ blog }: { blog: BlogPost }) {
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
  }, [blog.id]);

  return (
    <>
      <SeoHead
        title="Blog"
        titleTemplate={blog.title}
        description={blog.description}
        imgUrl={`${isDevImageUrl}/api/og?title=${encodeURIComponent(blog.title)}`}
      />
      <Layout title={blog.title} className="md:px-12 lg:px-16">
        <div className="md:grid md:grid-cols-12 md:gap-10 mt-10">
          <aside className="md:col-span-3 mb-10 md:mb-0">
            <div className="md:sticky md:top-10 space-y-8">
              <div>
                <p className="font-mono text-2xs uppercase tracking-wider text-ink-secondary mb-2">
                  公開日
                </p>
                <p className="text-sm text-ink-primary tnum">
                  {formatDate(blog.createdAt)}
                </p>
              </div>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <div>
                  <p className="font-mono text-2xs uppercase tracking-wider text-ink-secondary mb-2">
                    更新日
                  </p>
                  <p className="text-sm text-ink-primary tnum">
                    {formatDate(blog.updatedAt)}
                  </p>
                </div>
              )}
              <TableOfContents toc={toc} />
            </div>
          </aside>

          <article className="md:col-span-9">
            <div
              className="prose prose-slate max-w-none"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: rendered HTML
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          </article>
        </div>

        <div className="flex justify-center mt-20">
          <Button handleClick={handleClickBlogPostLike}>いいね！</Button>
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

export const getStaticProps = async (context: { params: { id: string } }) => {
  const blog = getBlog(context.params.id);
  if (!blog) {
    return { notFound: true as const };
  }
  return { props: { blog } };
};
