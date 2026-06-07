import { SeoHead } from "@/components/SeoHead";
import { getPublishedDate, isPostWithPath, isPostWithUrl } from "@/libs/common";
import { getBlogs } from "@/libs/content";
import type { BlogPost, BlogPosts } from "@/types/blog";
import type { QiitaPost } from "@/types/Qiita";
import Link from "next/link";
import Layout from "../layout";

function isBlogPost(post: BlogPost | QiitaPost | ZennPost): post is BlogPost {
  return (post as BlogPost).heroImage !== undefined;
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
      />
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
              {isBlogPost(post) && post.heroImage && (
                <img
                  className="w-full"
                  src={post.heroImage.url}
                  alt="Blog image"
                />
              )}
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

export const getStaticProps = async () => {
  const blog: BlogPosts = getBlogs();
  return {
    props: {
      blog,
    },
  };
};
