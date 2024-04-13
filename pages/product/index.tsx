import Layout from "../layout";
import { client } from "@/libs/client";
import { Products } from "@/types/product";
import Link from "next/link";
export default function Product({ products }: { products: Products }) {
  return (
    <Layout title="Product">
      <ul className="list-disc">
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.id}`}>{product.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "products" });
  return {
    props: {
      products: data.contents,
    },
  };
};
