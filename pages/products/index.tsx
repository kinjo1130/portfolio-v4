import { SeoHead } from "@/components/SeoHead";
import { getProducts } from "@/libs/content";
import type { Products } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import Layout from "../layout";

const year = (iso: string) => new Date(iso).getFullYear();

export default function Product({ products }: { products: Products }) {
	return (
		<Layout
			title="Products"
			eyebrow="§ 04 — Products"
			issueNumber="§ 04 — 2026"
		>
			<SeoHead
				title="Products"
				titleTemplate="プロダクト一覧"
				description="Products List"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="small-caps text-sm font-semibold text-ink-primary tracking-wider">
						Index
					</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(products.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
					{products.map((product, i) => (
						<li
							key={product.slug}
							className="border-t border-ink-primary pt-4"
						>
							<div className="flex items-baseline justify-between mb-4">
								<span className="tnum small-caps text-sm font-medium text-ink-secondary">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="small-caps text-sm font-semibold text-ink-primary tnum">
									{year(product.publishedAt)}
								</span>
							</div>
							<Link
								href={`/products/${product.slug}`}
								className="block link-draw no-underline group"
							>
								<div className="relative overflow-hidden border border-line">
									<Image
										src={product.image.url}
										alt={product.title}
										width={product.image.width}
										height={product.image.height}
										className="w-full h-auto"
									/>
								</div>
								<p className="jp-display text-xl md:text-2xl font-medium text-ink-primary mt-4">
									{product.title}
								</p>
								{product.description && (
									<p className="text-sm text-ink-secondary mt-2 leading-relaxed">
										{product.description}
									</p>
								)}
							</Link>
						</li>
					))}
				</ul>
			</section>
		</Layout>
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
