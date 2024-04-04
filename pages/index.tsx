import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export default function Home({ blog }: { blog: BlogPost[] }) {
  return (
    <div>
      <ul className="list-disc">
        <li>
          <Link href="/blog">blog</Link>
        </li>
        <li>
          <Link href="/product">product</Link>
        </li>
        <li>
          <Link href="/about">about</Link>
        </li>
        <li>
          <Link href="/work">work</Link>
        </li>
      </ul>
    </div>
  );
}

// // データをテンプレートに受け渡す部分の処理を記述します
// export const getStaticProps = async () => {
//   const data = await client.get({ endpoint: "blogs" });

//   return {
//     props: {
//       blog: data.contents,
//     },
//   };
// };
