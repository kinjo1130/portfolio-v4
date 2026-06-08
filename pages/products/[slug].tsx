import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getProduct, getProducts } from "@/libs/content";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import Layout from "../layout";

export default function ProductDetail({ product }: { product: Product }) {
	return (
		<Layout
			title={product.title}
			eyebrow="§ 04 — Products"
			issueNumber="§ 04 — 2026"
		>
			<SeoHead
				title="Products"
				titleTemplate={product.title}
				description={product.description ?? product.title}
				imgUrl={product.image.url}
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<aside className="col-span-12 md:col-span-3">
					<dl className="space-y-4 text-sm">
						<div>
							<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
								Published
							</dt>
							<dd className="font-semibold text-ink-primary mt-1 tnum">
								{formatDate(product.publishedAt)}
							</dd>
						</div>
						<div>
							<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
								Updated
							</dt>
							<dd className="font-semibold text-ink-primary mt-1 tnum">
								{formatDate(product.updatedAt)}
							</dd>
						</div>
						{product.url && (
							<div>
								<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
									Link
								</dt>
								<dd className="mt-1">
									<a
										href={product.url}
										target="_blank"
										rel="noopener noreferrer"
										className="link-draw small-caps text-sm font-semibold text-ink-primary no-underline"
									>
										Visit →
									</a>
								</dd>
							</div>
						)}
					</dl>
				</aside>

				<article className="col-span-12 md:col-span-9">
					<div className="border border-line mb-10">
						<Image
							src={product.image.url}
							alt={product.title}
							width={product.image.width}
							height={product.image.height}
							className="w-full h-auto"
						/>
					</div>
					{product.description && (
						<p className="text-lg md:text-xl font-medium leading-relaxed mb-10">
							{product.description}
						</p>
					)}
					{product.body && (
						<div
							className="prose prose-editorial max-w-none"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
							dangerouslySetInnerHTML={{ __html: product.body }}
						/>
					)}
					<div className="mt-16 pt-6 border-t border-line">
						<Link
							href="/products"
							className="small-caps text-sm font-semibold text-ink-primary link-draw no-underline"
						>
							← Back to index
						</Link>
					</div>
				</article>
			</section>
		</Layout>
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
