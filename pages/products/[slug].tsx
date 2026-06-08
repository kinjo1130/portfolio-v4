import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getProduct, getProducts } from "@/libs/content";
import type { Product } from "@/types/product";
import Image from "next/image";
import Layout from "../layout";

export default function ProductDetail({ product }: { product: Product }) {
	return (
		<>
			<SeoHead
				title="Products"
				titleTemplate={product.title}
				description={product.description ?? product.title}
				imgUrl={product.image.url}
			/>
			<Layout title={product.title}>
				<div className="mb-2">
					<p>公開日: {formatDate(product.publishedAt)}</p>
					<p>更新日: {formatDate(product.updatedAt)}</p>
				</div>
				<Image
					src={product.image.url}
					alt={product.title}
					width={product.image.width}
					height={product.image.height}
					sizes="(min-width: 768px) 640px, 100vw"
					className="mx-auto h-auto w-auto max-h-[70vh] max-w-full object-contain"
				/>
				{product.url && (
					<div className="mt-6">
						<h3 className="text-lg font-bold mb-2">作品URL</h3>
						<a
							href={product.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 underline"
						>
							{product.url}
						</a>
					</div>
				)}
				{product.body && (
					<div
						className="mt-8 prose prose-slate max-w-none"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
						dangerouslySetInnerHTML={{ __html: product.body }}
					/>
				)}
				{product.description && (
					<div className="mt-10">
						<p>{product.description}</p>
					</div>
				)}
			</Layout>
		</>
	);
}

export const getStaticPaths = async () => {
	const products = await getProducts();
	const paths = products.map((p) => `/products/${p.slug}`);
	return { paths, fallback: false };
};

export const getStaticProps = async (context: {
	params: { slug: string };
}) => {
	const product = await getProduct(context.params.slug);
	if (!product) {
		return { notFound: true as const };
	}
	return { props: { product } };
};
