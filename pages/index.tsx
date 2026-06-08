import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import SNS from "@/components/SNS";
import { SeoHead } from "@/components/SeoHead";
import { getBlogs, getProducts, getWorks } from "@/libs/content";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";
import type { Work } from "@/types/work";
import Link from "next/link";

const ACHIEVEMENTS = [
	{
		title: "Civictech Challenge Cup u-21 Code for japan賞",
		url: "https://ccc2021.code4japan.org",
		year: "2021",
	},
	{
		title: "ハックツハッカソン ツマジロカップ studist賞",
		url: "https://hackz.team/news/28VSpLaigPOw6KcqbgbVZT",
		year: "2023",
	},
	{
		title: "ハックツハッカソン スピノカップ 最優秀賞",
		url: "https://x.com/Hackz_team/status/1839224546358079765",
		year: "2024",
	},
];

const year = (iso: string) => new Date(iso).getFullYear();

type Props = {
	featuredWorks: Pick<Work, "slug" | "title" | "fromAt" | "toAt">[];
	featuredProducts: Pick<Product, "slug" | "title" | "publishedAt">[];
	recentPosts: Pick<BlogPost, "id" | "title" | "createdAt">[];
};

export default function Home({
	featuredWorks,
	featuredProducts,
	recentPosts,
}: Props) {
	return (
		<>
			<SeoHead
				title="Home"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="A frontend engineer's portfolio."
				imgUrl="/favicon.ico"
			/>
			<div className="min-h-screen text-ink-primary">
				<div className="flex justify-center">
					<Header />
				</div>

				<main className="px-6 md:px-12 lg:px-20 pb-32">
					{/* Issue meta strip */}
					<div className="flex items-baseline justify-between border-b border-ink-primary py-3 small-caps text-sm font-semibold text-ink-primary">
						<span>kinjo.me</span>
						<span className="tnum">§ 01 — 2026</span>
					</div>

					{/* Cover */}
					<section className="pt-16 md:pt-24 lg:pt-32 pb-20 lg:pb-28">
						<p className="small-caps text-sm font-semibold text-ink-primary mb-10 ink-settle tracking-wider">
							a product engineer&apos;s portfolio
						</p>

						<h1
							className="jp-display font-black leading-[0.92] tracking-tighter ink-settle"
							style={{
								fontSize: "clamp(40px, 12vw, 192px)",
							}}
						>
							金城翔太郎
						</h1>

						<p
							className="font-bold mt-6 tracking-tight text-ink-secondary ink-settle"
							style={{ fontSize: "clamp(18px, 4vw, 48px)", letterSpacing: "0.01em" }}
						>
							Shotaro Kinjo
						</p>

						<div className="mt-16 lg:mt-20 grid grid-cols-12 gap-6">
							<p className="col-span-12 md:col-span-7 text-xl md:text-2xl font-medium leading-relaxed">
								ソフトウェアで少しの役立つものをつくるために
								<br className="hidden md:inline" />
								コードを書くということをしています。
							</p>
							<div className="col-span-12 md:col-span-4 md:col-start-9 small-caps text-sm font-semibold text-ink-primary self-end space-y-2 tracking-wider">
								<p>FRONTEND ENGINEER</p>
								<p>KANSAI UNIVERSITY, INFO SCIENCE</p>
								<p>BASED IN OSAKA</p>
							</div>
						</div>
					</section>

					<span className="rule-line" />

					{/* Featured: Work */}
					<section className="pt-16 lg:pt-20 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="small-caps text-sm font-semibold text-ink-primary">
								Featured — Work
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								01 / {String(featuredWorks.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredWorks.map((work, i) => (
								<li
									key={work.slug}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/work/${work.slug}`}
										className="col-span-7 md:col-span-7 link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary"
									>
										{work.title}
									</Link>
									<span className="col-span-2 small-caps text-sm font-semibold text-ink-primary tnum hidden md:block">
										{year(work.fromAt)}—
										{work.toAt ? year(work.toAt) : "now"}
									</span>
									<span className="col-span-4 md:col-span-2 small-caps text-sm font-medium text-ink-secondary text-right">
										{work.toAt ? "closed" : "ongoing"}
									</span>
								</li>
							))}
						</ul>
						<Link
							href="/work"
							className="col-span-12 md:col-start-4 md:col-span-9 small-caps text-sm font-semibold text-ink-primary link-draw mt-2"
						>
							see all work →
						</Link>
					</section>

					{/* Featured: Products */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="small-caps text-sm font-semibold text-ink-primary">
								Featured — Products
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								02 / {String(featuredProducts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredProducts.map((product, i) => (
								<li
									key={product.slug}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/products/${product.slug}`}
										className="col-span-9 link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary"
									>
										{product.title}
									</Link>
									<span className="col-span-2 small-caps text-sm font-semibold text-ink-primary tnum text-right">
										{year(product.publishedAt)}
									</span>
								</li>
							))}
						</ul>
						<Link
							href="/products"
							className="col-span-12 md:col-start-4 md:col-span-9 small-caps text-sm font-semibold text-ink-primary link-draw mt-2"
						>
							see all products →
						</Link>
					</section>

					{/* Recent: Blog */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="small-caps text-sm font-semibold text-ink-primary">
								Recent — Writing
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								03 / {String(recentPosts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{recentPosts.map((post, i) => (
								<li
									key={post.id}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/blog/${post.id}`}
										className="col-span-9 link-draw jp-display text-lg md:text-xl font-medium text-ink-primary"
									>
										{post.title}
									</Link>
									<span className="col-span-2 small-caps text-sm font-semibold text-ink-primary tnum text-right">
										{year(post.createdAt)}
									</span>
								</li>
							))}
						</ul>
						<Link
							href="/blog"
							className="col-span-12 md:col-start-4 md:col-span-9 small-caps text-sm font-semibold text-ink-primary link-draw mt-2"
						>
							see all writing →
						</Link>
					</section>

					{/* Awards */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="small-caps text-sm font-semibold text-ink-primary">Awards</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{ACHIEVEMENTS.map((a, i) => (
								<li
									key={a.title}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<a
										href={a.url}
										target="_blank"
										rel="noopener noreferrer"
										className="col-span-9 link-draw text-base md:text-lg font-medium text-ink-primary"
									>
										{a.title}
									</a>
									<span className="col-span-2 small-caps text-sm font-semibold text-ink-primary tnum text-right">
										{a.year}
									</span>
								</li>
							))}
						</ul>
					</section>

					{/* Colophon */}
					<section className="pt-24 lg:pt-32">
						<p className="small-caps text-sm font-semibold text-ink-primary mb-6">
							Colophon — elsewhere
						</p>
						<SNS />
					</section>
				</main>

				<Footer />
			</div>
		</>
	);
}

export const getStaticProps = async () => {
	const works = await getWorks();
	const products = await getProducts();
	const blogs = getBlogs();

	const ongoing = works.filter((w) => !w.toAt);
	const closed = works.filter((w) => w.toAt);
	const featuredWorks = [...ongoing, ...closed].slice(0, 4).map((w) => ({
		slug: w.slug,
		title: w.title,
		fromAt: w.fromAt,
		toAt: w.toAt,
	}));

	const featuredProducts = products.slice(0, 3).map((p) => ({
		slug: p.slug,
		title: p.title,
		publishedAt: p.publishedAt,
	}));

	const recentPosts = blogs.slice(0, 3).map((p) => ({
		id: p.id,
		title: p.title,
		createdAt: p.createdAt,
	}));

	return {
		props: { featuredWorks, featuredProducts, recentPosts },
	};
};
