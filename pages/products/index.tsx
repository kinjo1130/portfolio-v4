import { SeoHead } from "@/components/SeoHead";
import { getProducts } from "@/libs/content";
import type { Products } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import Layout from "../layout";

const year = (iso: string) => new Date(iso).getFullYear();

export default function Product({ products }: { products: Products }) {
	return (
		<Layout title="Products">
			<SeoHead
				title="Products"
				titleTemplate="プロダクト一覧"
				description="Products List"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="text-sm font-medium text-ink-secondary">Index</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(products.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
					{products.map((product, i) => (
						<li key={product.slug}>
							<Link
								href={`/products/${product.slug}`}
								className="block no-underline group border border-line rounded-card bg-surface-card shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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
								<div className="p-5">
									<div className="flex items-baseline justify-between gap-4">
										<p className="jp-display text-xl md:text-2xl font-medium text-ink-primary">
											{product.title}
										</p>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{year(product.publishedAt)}
										</span>
									</div>
									{product.description && (
										<p className="text-base text-ink-secondary mt-2 leading-relaxed">
											{product.description}
										</p>
									)}
								</div>
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
