import { SeoHead } from "@/components/SeoHead";
import { client } from "@/libs/client";
import { formatDate } from "@/libs/common";
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
					src={`${product.image.url}?fit=fill&fill-color=d3d3d3&w=500&h=300`}
					alt="product image"
					width={product.image.width}
					height={500}
					className="w-full"
					objectFit="contain"
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
						{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
						<div dangerouslySetInnerHTML={{ __html: product.content }} />
					</div>
				)}
				<div className="mt-10">
					<p>{product.description}</p>
				</div>
				{/* ここの表示する内容を考える */}
			</Layout>
		</>
	);
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
	const data = await client.get({ endpoint: "products" });

	const paths = data.contents.map(
		(content: Product) => `/products/${content.id}`,
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
