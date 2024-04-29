import { client } from "@/libs/client";
import Layout from "../layout";
import { Product } from "@/types/product";
import Image from "next/image";
import { formatDate } from "@/libs/commom";

export default function ProductId({ product }: { product: Product }) {
  return (
    <Layout title={product.title}>
      <div className="mb-2">
        <p>公開日: {formatDate(product.createdAt)}</p>
        <p>更新日: {formatDate(product.updatedAt)}</p>
      </div>
      <Image
        src={product.image.url + "?fit=fill&fill-color=d3d3d3&w=500&h=300"}
        alt="product image"
        width={product.image.width}
        height={500}
        className="w-full"
        objectFit="contain"
      />
      <div className="mt-10">
        <p>{product.description}</p>
      </div>
      {/* ここの表示する内容を考える */}
    </Layout>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "products" });

  const paths = data.contents.map(
    (content: Product) => `/products/${content.id}`
  );
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
