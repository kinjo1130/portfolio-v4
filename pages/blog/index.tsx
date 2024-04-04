import { client } from "@/libs/client";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
export default function Blog({ blog }: { blog: BlogPost[] }) {
  return (
    <div>
      <ul className="list-disc">
        {blog.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blogs" });

  return {
    props: {
      blog: data.contents,
    },
  };
};
