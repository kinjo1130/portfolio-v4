import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog";
import { client } from "@/libs/client";
import Layout from "../layout";
import { formatDate } from "@/libs/commom";
import { renderToc } from "@/libs/renderDoc";
import { SeoHead } from "@/components/SeoHead";

import { TableOfContents } from "@/components/TableOfContents";
import Button from "@/components/Button";
import Link from "next/link";

export default function BlogId({ blog }: { blog: BlogPost }) {
  const toc = renderToc(blog.body);
  return (
    <>
      <SeoHead
        title="Blog"
        titleTemplate={blog.title}
        description={blog.description}
        imgUrl="https://localhost:3000/api/ogp"
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
