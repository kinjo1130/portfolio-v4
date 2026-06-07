import { SeoHead } from "@/components/SeoHead";
import { getProducts } from "@/libs/content";
import type { Products } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import Layout from "../layout";

export default function Product({ products }: { products: Products }) {
	return (
		<>
			<SeoHead
				title="Products"
				titleTemplate="プロダクト一覧"
				description="Products List"
				imgUrl="/favicon.ico"
			/>
			<Layout title="Products">
				<ul className="ml-5 grid md:grid-cols-3 gap-4 ">
					{products.map((product) => (
						<li
							key={product.slug}
							className="py-1 border-2 hover:border-gray-400 rounded overflow-hidden shadow-lg"
						>
							<Link href={`/products/${product.slug}`}>
								<Image
									src={product.image.url}
									alt="product image"
									width={product.image.width}
									height={product.image.height}
									className="w-full"
								/>
								<p className="text-center font-semibold mt-3">
									{product.title}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</Layout>
		</>
	);
}

export const getStaticProps = async () => {
	const products = await getProducts();
	return {
		props: {
			products,
		},
	};
};
