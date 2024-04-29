import Layout from "../layout";
import { client } from "@/libs/client";
import { Products } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
export default function Product({ products }: { products: Products }) {
  return (
    <Layout title="Products">
      <ul className="ml-5 grid grid-cols-3 gap-4 ">
        {products.map((product) => (
          <li key={product.id} className="py-1 border ">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image.url}
                alt="product image"
                width={product.image.width}
                height={product.image.height}
                className="w-full"
                objectFit="contain"
              />
              <p className="text-center font-semibold mt-3">{product.title}</p>
            </Link>
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
