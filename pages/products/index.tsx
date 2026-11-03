import { SeoHead } from "@/components/SeoHead";
import { getProducts } from "@/libs/content";
import type { Products } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import Layout from "../layout";

const year = (iso: string) => new Date(iso).getFullYear();

export default function Product({ products }: { products: Products }) {
	return (
		<Layout title="プロダクト">
			<SeoHead
				title="プロダクト"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="個人でつくったプロダクトの一覧です。"
				imgUrl="/ogp.png"
			/>

			{/* 件数はカードの上に 1 行で置き、カードには全幅を使う */}
			<section className="grid gap-5 pt-6 md:pt-8 lg:pt-6">
				<p className="tnum text-sm font-medium text-ink-secondary">
					{products.length}件
				</p>

				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
					{products.map((product, i) => (
						<li key={product.slug}>
							<div className="border border-line rounded-card bg-surface-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
								<Link
									href={`/products/${product.slug}`}
									className="block no-underline"
								>
									<div className="relative overflow-hidden border-b border-line aspect-[1200/630] bg-surface-sunken">
										<Image
											src={product.image.url}
											alt={product.title}
											width={product.image.width}
											height={product.image.height}
											className="w-full h-full object-contain"
										/>
									</div>
								</Link>
								<div className="p-5">
									<div className="flex items-baseline justify-between gap-4">
										<Link
											href={`/products/${product.slug}`}
											className="jp-display text-xl md:text-2xl font-medium text-ink-primary no-underline link-draw"
										>
											{product.title}
										</Link>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{year(product.publishedAt)}
										</span>
									</div>
									{product.description && (
										<p className="text-base text-ink-secondary mt-2 leading-relaxed">
											{product.description}
										</p>
									)}
									{product.url && (
										<a
											href={product.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block text-sm font-medium text-ink-primary link-draw no-underline mt-3"
										>
											{product.url.includes("github.com")
												? "GitHub →"
												: "サイトを見る →"}
										</a>
									)}
								</div>
							</div>
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
