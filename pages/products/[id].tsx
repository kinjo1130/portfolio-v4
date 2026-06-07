import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getProduct, getProducts } from "@/libs/content";
import type { Product } from "@/types/product";
import Image from "next/image";
import Layout from "../layout";

export default function ProductId({ product }: { product: Product }) {
	return (
		<>
			<SeoHead
				title="Products"
				titleTemplate={product.title}
				description={product.description}
				imgUrl={product.image.url}
			/>
			<Layout title={product.title}>
				<div className="mb-2">
					<p>公開日: {formatDate(product.createdAt)}</p>
					<p>更新日: {formatDate(product.updatedAt)}</p>
				</div>
				<Image
					src={product.image.url}
					alt="product image"
					width={product.image.width}
					height={product.image.height}
					className="w-full"
				/>
				{product.URL && (
					<div className="mt-6">
						<h3 className="text-lg font-bold mb-2">作品URL</h3>
						<a
							href={product.URL}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 underline"
						>
							{product.URL}
						</a>
					</div>
				)}
				{product.content && (
					<div className="mt-8 prose prose-slate max-w-none">
						{/* biome-ignore lint/security/noDangerouslySetInnerHtml: content is authored locally */}
						<div dangerouslySetInnerHTML={{ __html: product.content }} />
					</div>
				)}
				<div className="mt-10">
					<p>{product.description}</p>
				</div>
			</Layout>
		</>
	);
}

export const getStaticPaths = async () => {
	const paths = getProducts().map((product) => `/products/${product.id}`);
	return { paths, fallback: false };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
	const product = getProduct(context.params.id);
	if (!product) {
		return { notFound: true as const };
	}
	return {
		props: {
			product,
		},
	};
};
