import { client } from "@/libs/client";
import Layout from "../layout";
import { Product } from "@/types/product";

export default function ProductId({ product }: { product: Product }) {
  return (
    <Layout title={product.title}>
      <h1>{product.title}</h1>
      <p>{product.publishedAt}</p>
      {/* ここの表示する内容を考える */}
    </Layout>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "products" });

  const paths = data.contents.map((content: Product) => `/product/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context: any) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "products", contentId: id });
  console.log({ data });

  return {
    props: {
      product: data,
    },
  };
};
